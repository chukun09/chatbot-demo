import { ChatHistory, Draft } from '../types';

const CHAT_HISTORY_KEY = 'chatbot_history';
const DRAFTS_KEY = 'chatbot_drafts';

export const saveChatHistory = (history: ChatHistory[]): void => {
  try {
    localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

export const loadChatHistory = (): ChatHistory[] => {
  try {
    const data = localStorage.getItem(CHAT_HISTORY_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      messages: item.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const saveDrafts = (drafts: Draft[]): void => {
  try {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save drafts:', error);
  }
};

export const loadDrafts = (): Draft[] => {
  try {
    const data = localStorage.getItem(DRAFTS_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
    }));
  } catch (error) {
    console.error('Failed to load drafts:', error);
    return [];
  }
};


