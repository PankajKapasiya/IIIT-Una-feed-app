# 🚀 IIIT-Una Feed - AI-Powered Campus Feed Application

A modern, AI-powered campus feed application built for the IIIT-Una AI Hackathon Challenge. This application allows students to create posts using natural language input, with AI automatically classifying content into Events, Lost & Found, and Announcements.

## ✨ Features

### 🎯 Core Features
- **Single Textbox Post Creation**: Type naturally and let AI figure out the post type
- **Smart Post Classification**: Automatically categorizes posts as Events, Lost & Found, or Announcements
- **Editable Preview**: Review and edit your post before publishing
- **AI-Powered Content Extraction**: Automatically extracts relevant information from natural language

### 🎉 Post Types
1. **Event Posts**: Workshops, fests, club activities with RSVP functionality
2. **Lost & Found Posts**: Report lost items or announce found items
3. **Announcement Posts**: Official notices, timetables, campus updates

### 🤖 AI Features
- **Intent Recognition**: Understands post intent from natural language
- **Content Moderation**: Toxicity detection and warnings
- **Meme Generation**: Generate memes in comments using `/meme <prompt>` command
- **Smart Suggestions**: AI-powered content enhancement

### 💬 Social Features
- **Comments & Replies**: Threaded discussions with nested replies
- **Reactions**: Like, love, and other reactions on posts and comments
- **File Attachments**: Support for images and PDFs
- **Real-time Updates**: Live feed updates

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Server**: Express.js with middleware for security and rate limiting
- **AI Integration**: OpenAI API for post classification and content generation
- **File Handling**: Multer for file uploads
- **In-Memory Storage**: For development (easily replaceable with database)

### Frontend (React)
- **UI Framework**: React with modern hooks and functional components
- **Styling**: Tailwind CSS for responsive design
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks for local state
- **Routing**: React Router for navigation

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Feed-App
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   npm run install-client
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp env.example .env
   
   # Edit .env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev-full
   
   # Or start separately:
   # Backend only
   npm run dev
   
   # Frontend only (in another terminal)
   cd client && npm start
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 Usage

### Creating Posts
1. Navigate to "Create Post"
2. Type your message naturally (e.g., "Lost my black wallet near the library yesterday evening")
3. AI will classify and extract information
4. Review and edit the preview
5. Add optional attachments
6. Publish your post

### AI Commands in Comments
- **Meme Generation**: Type `/meme <prompt>` to generate a meme
- **Example**: `/meme funny campus life`

### Post Interactions
- **RSVP for Events**: Going, Interested, Not Going
- **Reactions**: Like, Love, Laugh, Wow
- **Comments**: Add threaded discussions
- **File Attachments**: Images and PDFs

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=server/uploads

# Security
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### API Endpoints

#### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

#### AI Services
- `POST /api/ai/classify` - Classify post intent
- `POST /api/ai/meme` - Generate meme
- `POST /api/ai/toxicity` - Check content toxicity
- `POST /api/ai/enhance` - Enhance post content

#### Comments
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## 🎨 Customization

### Styling
- Modify `client/src/index.css` for global styles
- Update `client/tailwind.config.js` for theme customization
- Component-specific styles in individual component files

### AI Behavior
- Adjust prompts in `server/services/aiService.js`
- Modify classification logic and content extraction
- Customize toxicity detection thresholds

### Post Types
- Add new post types in the AI service
- Update frontend components to handle new types
- Modify database schema (when migrating from in-memory)

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Set environment
NODE_ENV=production

# Start production server
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

### Manual Testing
1. **Post Creation Flow**: Test the complete post creation process
2. **AI Classification**: Verify different post types are correctly identified
3. **File Uploads**: Test image and PDF attachments
4. **Comments & Reactions**: Test social features
5. **Meme Generation**: Test AI meme generation in comments

### API Testing
- Use tools like Postman or Insomnia
- Test all endpoints with various payloads
- Verify error handling and validation

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Secure cross-origin requests
- **File Validation**: Secure file uploads
- **Content Moderation**: AI-powered toxicity detection
- **Input Sanitization**: Prevents XSS attacks

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- Use consistent formatting
- Follow React best practices
- Maintain component reusability
- Add proper error handling

## 📋 Hackathon Requirements Met

✅ **Single Textbox → Smart Classification → Editable Preview**  
✅ **Three Post Types**: Events, Lost & Found, Announcements  
✅ **AI-Powered Features**: Classification, content extraction, meme generation  
✅ **Toxicity Guard**: Content moderation and warnings  
✅ **Comments & Reactions**: Threaded discussions with reactions  
✅ **File Attachments**: Image and PDF support  
✅ **Clean UI/UX**: Modern, responsive design  
✅ **No Authentication**: Simulated user sessions  

## 🏆 Judging Criteria Alignment

- **Completion & Functionality (30%)**: All core features implemented ✅
- **Design & User Experience (20%)**: Clean, intuitive interface ✅
- **Collaboration & Teamwork (25%)**: Modular, well-structured code ✅
- **Code Practices (25%)**: Clean, maintainable codebase ✅

## 🚨 Important Notes

- **OpenAI API Key**: Required for AI features to work
- **File Storage**: Currently in-memory, consider database for production
- **User Sessions**: Simulated for hackathon (no real authentication)
- **Rate Limits**: OpenAI API has usage limits

## 📞 Support

For hackathon-related questions or technical issues:
- Check the documentation above
- Review the code comments
- Test with different inputs
- Verify API key configuration

## 🎯 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Real-time notifications
- Advanced AI features
- Mobile app version
- Analytics dashboard
- User authentication system

---

**Built with ❤️ for IIIT-Una AI Hackathon Challenge**

*This application demonstrates modern web development practices, AI integration, and user experience design principles.*
