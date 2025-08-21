const OpenAI = require('openai');

class AIService {
  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.isAiEnabled = !!apiKey;
    this.openai = this.isAiEnabled
      ? new OpenAI({ apiKey })
      : null;
  }

  async classifyPost(prompt) {
    try {
      if (!this.isAiEnabled) {
        // Basic heuristic fallback when AI is disabled
        const lower = String(prompt || '').toLowerCase();
        let postType = 'ANNOUNCEMENT';
        if (/(lost|found|wallet|id card|keys|phone|bag)/.test(lower)) postType = 'LOST_FOUND';
        if (/(event|workshop|meet|seminar|hackathon|fest|session|webinar)/.test(lower)) postType = 'EVENT';
        return {
          postType,
          confidence: 0.6,
          extractedData: { description: prompt },
          suggestedTitle: postType === 'EVENT' ? 'Upcoming Event' : postType === 'LOST_FOUND' ? 'Lost & Found' : 'Announcement',
          toxicityScore: 0
        };
      }
      const systemPrompt = `You are an AI assistant for IIIT-Una campus feed. Analyze the user's input and classify it into one of three post types:

1. EVENT - for workshops, fests, club activities, meetings
2. LOST_FOUND - for lost items or found items
3. ANNOUNCEMENT - for official notices, timetables, campus updates

Extract relevant entities and return a JSON response with:
- postType: "EVENT", "LOST_FOUND", or "ANNOUNCEMENT"
- confidence: 0-1 score
- extractedData: relevant information based on post type
- suggestedTitle: a concise title for the post
- toxicityScore: 0-1 score (1 being most toxic)

For EVENT posts, extract: description, location, date, time
For LOST_FOUND posts, extract: item, location, date, isLost (boolean)
For ANNOUNCEMENT posts, extract: department, content, priority

Example input: "Lost my black wallet near the library yesterday evening"
Expected output: {"postType": "LOST_FOUND", "confidence": 0.95, "extractedData": {...}}`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('AI classification error:', error);
      throw new Error('Failed to classify post');
    }
  }

  async generateMeme(prompt) {
    try {
      if (!this.isAiEnabled) {
        return null;
      }
      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a funny, campus-themed meme about: ${prompt}. Make it clean, appropriate, and relatable to college students.`,
        n: 1,
        size: "1024x1024",
      });

      return response.data[0].url;
    } catch (error) {
      console.error('Meme generation error:', error);
      throw new Error('Failed to generate meme');
    }
  }

  async checkToxicity(content) {
    try {
      if (!this.isAiEnabled) {
        return { toxicityScore: 0, isAppropriate: true, suggestions: [] };
      }
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a content moderation AI. Analyze the given text and return a JSON response with: toxicityScore (0-1, where 1 is most toxic), isAppropriate (boolean), and suggestions (array of improvement suggestions)."
          },
          {
            role: "user",
            content: content
          }
        ],
        temperature: 0.1,
        max_tokens: 200
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Toxicity check error:', error);
      return { toxicityScore: 0, isAppropriate: true, suggestions: [] };
    }
  }

  async enhancePostContent(prompt, postType) {
    try {
      if (!this.isAiEnabled) {
        return {
          title: postType === 'EVENT' ? 'Campus Event' : postType === 'LOST_FOUND' ? 'Lost & Found' : 'Announcement',
          description: String(prompt || ''),
          hashtags: ['#IIITUna', '#Campus', '#Feed'],
          suggestions: []
        };
      }
      const systemPrompt = `You are an AI assistant helping to enhance campus feed posts. Based on the user's input and post type, provide:
- A compelling title
- Enhanced description
- Relevant hashtags
- Suggested improvements

Post type: ${postType}
User input: ${prompt}

Return a JSON response with: title, description, hashtags, suggestions`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Content enhancement error:', error);
      throw new Error('Failed to enhance post content');
    }
  }
}

module.exports = new AIService();
