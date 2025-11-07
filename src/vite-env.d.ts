/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER: string
  readonly VITE_CLAUDE_API_KEY: string
  readonly VITE_OPENAI_API_KEY: string
  readonly VITE_AI_MODEL: string
  readonly VITE_AI_TEMPERATURE: string
  readonly VITE_AI_MAX_TOKENS: string
  readonly SEVER_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
