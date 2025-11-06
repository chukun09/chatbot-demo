export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Draft {
  id: string;
  content: string;
  createdAt: Date;
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'vi';

export interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}


