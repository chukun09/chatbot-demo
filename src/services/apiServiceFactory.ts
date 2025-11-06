import { BaseApiService, ApiServiceConfig } from './baseApiService';
import { ClaudeService } from './claudeService';
import { ChatGptService } from './chatGptService';

export type AiProvider = 'claude' | 'chatgpt';

export interface ApiServiceFactoryConfig {
  provider: AiProvider;
  claudeApiKey?: string;
  chatGptApiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class ApiServiceFactory {
  private static instance: ApiServiceFactory;
  private service: BaseApiService | null = null;

  private constructor() {}

  static getInstance(): ApiServiceFactory {
    if (!ApiServiceFactory.instance) {
      ApiServiceFactory.instance = new ApiServiceFactory();
    }
    return ApiServiceFactory.instance;
  }

  createService(config: ApiServiceFactoryConfig): BaseApiService {
    const { provider, claudeApiKey, chatGptApiKey, model, temperature, maxTokens } = config;

    let apiKey: string;
    let serviceConfig: ApiServiceConfig;

    switch (provider) {
      case 'claude':
        apiKey = claudeApiKey || this.getEnvVar('VITE_CLAUDE_API_KEY') || '';
        if (!apiKey) {
          throw new Error('Claude API key is required. Please set VITE_CLAUDE_API_KEY environment variable.');
        }
        serviceConfig = { apiKey, model, temperature, maxTokens };
        this.service = new ClaudeService(serviceConfig);
        break;

      case 'chatgpt':
        apiKey = chatGptApiKey || this.getEnvVar('VITE_OPENAI_API_KEY') || '';
        if (!apiKey) {
          throw new Error('OpenAI API key is required. Please set VITE_OPENAI_API_KEY environment variable.');
        }
        serviceConfig = { apiKey, model, temperature, maxTokens };
        this.service = new ChatGptService(serviceConfig);
        break;

      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }

    return this.service;
  }

  getService(): BaseApiService | null {
    return this.service;
  }

  private getEnvVar(name: string): string | undefined {
    return (import.meta.env as any)[name];
  }
}
