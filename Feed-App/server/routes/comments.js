const express = require('express');
const aiService = require('../services/aiService');

const router = express.Router();

// In-memory storage for comments (in production, use a database)
let comments = [];
let commentIdCounter = 1;

// Get comments for a post
router.get('/post/:postId', (req, res) => {
  try {
    const { postId } = req.params;
    const postComments = comments.filter(comment => comment.postId === parseInt(postId));
    res.json(postComments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create new comment
router.post('/', async (req, res) => {
  try {
    const { postId, content, userId, parentId, isMeme } = req.body;
    
    if (!postId || !content) {
      return res.status(400).json({ error: 'PostId and content are required' });
    }

    // Check for meme command
    let memeUrl = null;
    let processedContent = content;
    
    if (content.startsWith('/meme ')) {
      try {
        const memePrompt = content.substring(6); // Remove '/meme ' prefix
        memeUrl = await aiService.generateMeme(memePrompt);
        processedContent = `Generated meme: ${memePrompt}`;
      } catch (error) {
        console.error('Meme generation failed:', error);
        processedContent = content; // Fallback to original content
      }
    }

    // Toxicity check
    const toxicityCheck = await aiService.checkToxicity(processedContent);
    
    const comment = {
      id: commentIdCounter++,
      postId: parseInt(postId),
      content: processedContent,
      userId: userId || `user-${Date.now()}`,
      parentId: parentId || null,
      memeUrl,
      isMeme: !!memeUrl,
      toxicityScore: toxicityCheck.toxicityScore,
      isAppropriate: toxicityCheck.isAppropriate,
      reactions: {
        likes: 0,
        love: 0,
        laugh: 0,
        wow: 0
      },
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to parent comment if it's a reply
    if (parentId) {
      const parentComment = comments.find(c => c.id === parseInt(parentId));
      if (parentComment) {
        parentComment.replies.push(comment.id);
      }
    }

    comments.push(comment);
    res.status(201).json(comment);
  } catch (error) {
    console.error('Comment creation error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// Update comment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    // Toxicity check for updated content
    const toxicityCheck = await aiService.checkToxicity(content);
    const commentIndex = comments.findIndex(c => c.id === parseInt(id));
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    comments[commentIndex] = {
      ...comments[commentIndex],
      content,
      toxicityScore: toxicityCheck.toxicityScore,
      isAppropriate: toxicityCheck.isAppropriate,
      updatedAt: new Date().toISOString()
    };
    res.json(comments[commentIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

// Delete comment
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const commentIndex = comments.findIndex(c => c.id === parseInt(id));
    
    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Remove from parent comment's replies
    const comment = comments[commentIndex];
    if (comment.parentId) {
      const parentComment = comments.find(c => c.id === comment.parentId);
      if (parentComment) {
        parentComment.replies = parentComment.replies.filter(replyId => replyId !== comment.id);
      }
    }

    // Remove all replies to this comment
    comments = comments.filter(c => c.parentId !== comment.id);
    
    // Remove the comment itself
    comments.splice(commentIndex, 1);
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Add reaction to comment
router.post('/:id/reactions', (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;
    
    const comment = comments.find(c => c.id === parseInt(id));
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (comment.reactions[reactionType] !== undefined) {
      comment.reactions[reactionType]++;
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Get nested replies for a comment
router.get('/:id/replies', (req, res) => {
  try {
    const { id } = req.params;
    const comment = comments.find(c => c.id === parseInt(id));
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const replies = comments.filter(c => c.parentId === parseInt(id));
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
});

module.exports = router;
