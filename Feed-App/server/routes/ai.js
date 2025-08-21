const express = require('express');
const aiService = require('../services/aiService');

const router = express.Router();

// Classify post intent
router.post('/classify', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const classification = await aiService.classifyPost(prompt);
    res.json(classification);
  } catch (error) {
    console.error('Classification error:', error);
    res.status(500).json({ error: 'Failed to classify post' });
  }
});

// Generate meme
router.post('/meme', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const memeUrl = await aiService.generateMeme(prompt);
    res.json({ memeUrl });
  } catch (error) {
    console.error('Meme generation error:', error);
    res.status(500).json({ error: 'Failed to generate meme' });
  }
});

// Check content toxicity
router.post('/toxicity', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const toxicityCheck = await aiService.checkToxicity(content);
    res.json(toxicityCheck);
  } catch (error) {
    console.error('Toxicity check error:', error);
    res.status(500).json({ error: 'Failed to check toxicity' });
  }
});

// Enhance post content
router.post('/enhance', async (req, res) => {
  try {
    const { prompt, postType } = req.body;
    
    if (!prompt || !postType) {
      return res.status(400).json({ error: 'Prompt and postType are required' });
    }

    const enhancedContent = await aiService.enhancePostContent(prompt, postType);
    res.json(enhancedContent);
  } catch (error) {
    console.error('Content enhancement error:', error);
    res.status(500).json({ error: 'Failed to enhance content' });
  }
});

module.exports = router;
