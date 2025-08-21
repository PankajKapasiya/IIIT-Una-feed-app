const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const aiService = require('../services/aiService');

const router = express.Router();

// In-memory storage for posts (in production, use a database)
let posts = [];
let postIdCounter = 1;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  }
});

// Get all posts
router.get('/', (req, res) => {
  try {
    const sortedPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sortedPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get posts by type
router.get('/type/:postType', (req, res) => {
  try {
    const { postType } = req.params;
    const filteredPosts = posts.filter(post => post.postType === postType.toUpperCase());
    res.json(filteredPosts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts by type' });
  }
});

// Get single post
router.get('/:id', (req, res) => {
  try {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post with AI classification
router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // AI classification
    const classification = await aiService.classifyPost(prompt);
    
    // Toxicity check
    const toxicityCheck = await aiService.checkToxicity(prompt);
    
    const post = {
      id: postIdCounter++,
      prompt,
      postType: classification.postType,
      title: classification.suggestedTitle,
      content: classification.extractedData,
      userId: userId || `user-${Date.now()}`,
      attachment: req.file ? `/uploads/${req.file.filename}` : null,
      toxicityScore: toxicityCheck.toxicityScore,
      isAppropriate: toxicityCheck.isAppropriate,
      reactions: {
        going: 0,
        interested: 0,
        notGoing: 0,
        likes: 0,
        love: 0,
        laugh: 0,
        wow: 0
      },
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    posts.push(post);
    res.status(201).json(post);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content, postType } = req.body;
    
    posts[postIndex] = {
      ...posts[postIndex],
      title: title || posts[postIndex].title,
      content: content || posts[postIndex].content,
      postType: postType || posts[postIndex].postType,
      updatedAt: new Date().toISOString()
    };

    res.json(posts[postIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === parseInt(id));
    
    if (postIndex === -1) {
      return res.status(404).json({ error: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Add reaction to post
router.post('/:id/reactions', (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType } = req.body;
    
    const post = posts.find(p => p.id === parseInt(id));
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (post.reactions[reactionType] !== undefined) {
      post.reactions[reactionType]++;
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

module.exports = router;
