import { BaseApiService, ApiMessage, ApiResponse, ApiServiceConfig } from './baseApiService';

export class ChatGptService extends BaseApiService {
  constructor(config: ApiServiceConfig) {
    super({
      ...config,
      model: config.model || 'gpt-3.5-turbo',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
    });
  }

  async generateResponse(messages: ApiMessage[]): Promise<ApiResponse> {
    const url = 'https://api.openai.com/v1/chat/completions';

    const headers = {
      'Authorization': `Bearer ${this.config.apiKey}`,
    };

    const body = {
      model: this.config.model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    };

    try {
      const response = await this.makeRequest(url, headers, body);

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response choices returned from OpenAI');
      }

      return {
        content: choice.message.content,
        usage: {
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
          totalTokens: response.usage?.total_tokens,
        },
      };
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw new Error(`Failed to get response from ChatGPT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
