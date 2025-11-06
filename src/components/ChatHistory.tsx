import { ChatHistory as ChatHistoryType, Language } from '../types';
import { t } from '../utils/i18n';
import { MessageSquare, Trash2, Clock } from 'lucide-react';

interface ChatHistoryProps {
  history: ChatHistoryType[];
  currentChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  language: Language;
}

export const ChatHistory = ({
  history,
  currentChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  language,
}: ChatHistoryProps) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-black border-r border-gray-300 dark:border-gray-700">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2 shadow-md"
        >
          <MessageSquare size={18} />
          {t('newChat', language)}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-2">
          <h3 className="px-2 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('chatHistory', language)}
          </h3>
          {history.length === 0 ? (
            <div className="px-2 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              {t('noHistory', language)}
            </div>
          ) : (
            <div className="space-y-1">
              {history.map((chat) => (
                <div
                  key={chat.id}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                  }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black dark:text-white truncate">
                        {chat.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {chat.updatedAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


