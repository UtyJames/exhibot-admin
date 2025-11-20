// src/types/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TARGET: string
  readonly VITE_APP_ENV: 'development' | 'production'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}