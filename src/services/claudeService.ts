import { BaseApiService, ApiMessage, ApiResponse, ApiServiceConfig } from './baseApiService';

export class ClaudeService extends BaseApiService {
  constructor(config: ApiServiceConfig) {
    super({
      ...config,
      model: config.model || 'claude-3-sonnet-20240229',
      temperature: config.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? 1000,
      baseUrl: config.baseUrl || ''
    });
  }

  async generateResponse(messages: ApiMessage[]): Promise<ApiResponse> {
    var apiURL = this.config.baseUrl || import.meta.env.VITE_API_BASE || '';
    console.log('this.config.baseUrl', this.config.baseUrl);
    console.log('import.meta.env.VITE_API_BASE', import.meta.env.VITE_API_BASE);
    console.log('apiURL', apiURL);
    const url = `${apiURL}/api/anthropic`;

    // Convert our message format to Claude's format
    const claudeMessages = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const body = {
      model: this.config.model,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      messages: claudeMessages,
    };

    try {
      const response = await this.makeRequest(url, {}, body);
      console.log(response);
      return {
        content: response.content[0].text,
        usage: {
          promptTokens: response.usage?.input_tokens,
          completionTokens: response.usage?.output_tokens,
          totalTokens: response.usage?.input_tokens + response.usage?.output_tokens,
        },
      };
    } catch (error) {
      console.error('Claude API error:', error);
      throw new Error(`Failed to get response from Claude: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
