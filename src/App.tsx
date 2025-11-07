import { useState, useEffect } from 'react';
import { Message, ChatHistory, Language } from './types';
import { MessageBubble } from './components/MessageBubble';
import { ChatInput } from './components/ChatInput';
import { RecommendedQuestions } from './components/RecommendedQuestions';
import { ChatHistory as ChatHistoryComponent } from './components/ChatHistory';
import { LanguageSelector } from './components/LanguageSelector';
import { saveChatHistory, loadChatHistory } from './utils/storage';
import { t } from './utils/i18n';
import { Menu, X, MessageCircle } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { ApiServiceFactory, AiProvider, BaseApiService, ApiMessage } from './services';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [apiService, setApiService] = useState<BaseApiService | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check if dark class is already on document (set by main.tsx)
    if (document.documentElement.classList.contains('dark')) {
      return true;
    }
    // Fallback to localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadedHistory = loadChatHistory();
    setHistory(loadedHistory);
  }, []);

  useEffect(() => {
    const initializeApiService = () => {
      try {
        const factory = ApiServiceFactory.getInstance();
        const provider = (import.meta.env.VITE_AI_PROVIDER as AiProvider) || 'claude';
        const service = factory.createService({
          provider,
          model: import.meta.env.VITE_AI_MODEL,
          temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7'),
          maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '1000'),
          baseUrl: import.meta.env.SEVER_BASE_URL || ''
        });
        setApiService(service);
        setApiError(null);
      } catch (error) {
        console.error('Failed to initialize API service:', error);
        setApiError(error instanceof Error ? error.message : 'Failed to initialize API service');
      }
    };

    initializeApiService();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);


  const generateResponse = async (userMessage: string): Promise<string> => {
    if (!apiService) {
      throw new Error('API service not initialized');
    }

    // Convert chat messages to API format
    const apiMessages: ApiMessage[] = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the current user message
    apiMessages.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await apiService.generateResponse(apiMessages);
      return response.content;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await generateResponse(content);
      setIsLoading(false);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Save to history
      if (currentChatId) {
        const updatedHistory = history.map((chat: ChatHistory) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: updatedMessages,
                updatedAt: new Date(),
              }
            : chat
        );
        setHistory(updatedHistory);
        saveChatHistory(updatedHistory);
      } else {
        const newChat: ChatHistory = {
          id: Date.now().toString(),
          title: content.substring(0, 50),
          messages: updatedMessages,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const updatedHistory = [newChat, ...history];
        setHistory(updatedHistory);
        setCurrentChatId(newChat.id);
        saveChatHistory(updatedHistory);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setApiError(errorMessage);

      // Add error message to chat
      const errorAssistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        role: 'assistant',
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, errorAssistantMessage];
      setMessages(updatedMessages);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  const handleSelectChat = (chatId: string) => {
    const chat = history.find((h: ChatHistory) => h.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    const updatedHistory = history.filter((h: ChatHistory) => h.id !== chatId);
    setHistory(updatedHistory);
    saveChatHistory(updatedHistory);
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleSelectQuestion = (question: string) => {
    handleSend(question);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-black">
      {(isSidebarOpen || !isMobile) && (
        <div className={`${isMobile ? 'absolute inset-0 z-40' : 'w-64'} flex flex-col h-full`}>
          <ChatHistoryComponent
            history={history}
            currentChatId={currentChatId}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onNewChat={handleNewChat}
            language={language}
          />
        </div>
      )}

      {isMobile && isSidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 dark:bg-white/10 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden h-full">
        <header className="bg-white dark:bg-black border-b border-gray-300 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <MessageCircle className="text-black dark:text-white" size={24} />
              <h1 className="text-xl font-bold text-black dark:text-white">
                IRIS Chatbot AI
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </header>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide bg-white dark:bg-black">
            {messages.length === 0 ? (
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <MessageCircle
                    className="mx-auto text-black dark:text-white mb-4"
                    size={64}
                  />
                  <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {t('welcome', language)}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('noMessages', language)}
                  </p>
                </div>
                <RecommendedQuestions
                  language={language}
                  onSelect={handleSelectQuestion}
                />
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {apiError && (
                  <div className="flex gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                      <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-2xl rounded-tl-sm px-4 py-2.5">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        {apiError}
                      </p>
                    </div>
                  </div>
                )}
                {isLoading && (
                  <div className="flex gap-3 mb-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-2.5">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('loading', language)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <ChatInput
            onSend={handleSend}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

