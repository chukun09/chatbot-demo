export interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ApiResponse {
  content: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
}

export interface ApiServiceConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  baseUrl?: string;
}

export abstract class BaseApiService {
  protected config: ApiServiceConfig;

  constructor(config: ApiServiceConfig) {
    this.config = config;
  }

  abstract generateResponse(messages: ApiMessage[]): Promise<ApiResponse>;

  protected async makeRequest(url: string, headers: Record<string, string>, body: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
    }

    return response.json();
  }
}
