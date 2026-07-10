/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_FLIGHT_SEARCH?: string
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
