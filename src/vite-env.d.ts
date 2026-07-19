/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TALKS_DIR: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
