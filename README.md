# Chatbot AI - Modern Chatbot Interface

A beautiful, modern, and fully responsive chatbot UI built with React, TypeScript, and Tailwind CSS.

## Features

🤖 **AI Integration**
- Integration with Claude and ChatGPT APIs
- Configurable AI provider and model settings
- Real-time conversation with AI assistants

✨ **Multiple Languages Support**
- Supports 6 languages: English, Spanish, French, German, Chinese, and Japanese
- Seamless language switching with persistent UI translations

📝 **Draft Chat**
- Save messages as drafts before sending
- Access and manage saved drafts easily
- Auto-restore drafts when needed

💡 **Recommended Questions**
- Context-aware question suggestions based on selected language
- One-click question insertion

📚 **Chat History**
- Persistent chat history saved in localStorage
- Easy navigation between previous conversations
- Delete and manage chat history

📱 **Responsive Design**
- Fully optimized for mobile devices
- Beautiful desktop experience
- Adaptive sidebar and mobile menu

🎨 **Modern UI**
- Clean, modern design with smooth animations
- Dark mode support
- Beautiful gradient backgrounds
- Smooth transitions and hover effects

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### API Configuration

To enable AI responses, you need to configure API keys for your chosen AI provider:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file and add your API keys:

**For Claude (Anthropic):**
```env
VITE_AI_PROVIDER=claude
VITE_CLAUDE_API_KEY=your_claude_api_key_here
```

**For ChatGPT (OpenAI):**
```env
VITE_AI_PROVIDER=chatgpt
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

**Optional Configuration:**
```env
VITE_AI_MODEL=claude-3-sonnet-20240229  # or gpt-3.5-turbo for ChatGPT
VITE_AI_TEMPERATURE=0.7
VITE_AI_MAX_TOKENS=1000
```

3. Restart the development server to apply changes.

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
ChatbotAI/
├── src/
│   ├── components/          # React components
│   │   ├── MessageBubble.tsx
│   │   ├── ChatInput.tsx
│   │   ├── RecommendedQuestions.tsx
│   │   ├── ChatHistory.tsx
│   │   ├── DraftsPanel.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── ThemeToggle.tsx
│   ├── services/            # API service classes
│   │   ├── baseApiService.ts
│   │   ├── claudeService.ts
│   │   ├── chatGptService.ts
│   │   ├── apiServiceFactory.ts
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   ├── i18n.ts          # Internationalization
│   │   ├── storage.ts       # LocalStorage helpers
│   │   └── recommendedQuestions.ts
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts        # Vite environment types
├── .env.example             # Environment variables template
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## Usage

### Starting a New Chat
Click the "New Chat" button in the sidebar to start a fresh conversation.

### Saving Drafts
Type your message and click the save icon (💾) in the input area to save it as a draft.

### Using Recommended Questions
Click on any recommended question button to automatically send it as a message.

### Switching Languages
Use the language selector in the header to change the interface language.

### Managing Chat History
- View all previous chats in the sidebar
- Click on a chat to load it
- Hover over a chat and click the delete icon to remove it

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **LocalStorage** - Data persistence
- **Claude API** - Anthropic's AI assistant
- **ChatGPT API** - OpenAI's AI assistant

## Customization

### Adding New Languages

1. Add the language code to the `Language` type in `src/types/index.ts`
2. Add translations in `src/utils/i18n.ts`
3. Add recommended questions in `src/utils/recommendedQuestions.ts`
4. Update the `languages` array in `src/components/LanguageSelector.tsx`

### Styling

The app uses Tailwind CSS. Customize colors and themes in `tailwind.config.js`.

## License

MIT License - feel free to use this project for your own purposes.


