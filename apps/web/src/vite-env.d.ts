/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    electron?: {
      getUserDataPath: () => Promise<string>;
      getBackendUrl: () => Promise<string>;
      openFolder: (path: string) => Promise<{ success: boolean; error?: string }>;
      openEmailClient: (to: string, subject: string, body?: string) => Promise<{ success: boolean; error?: string }>;
      platform: string;
      versions: {
        node: string;
        chrome: string;
        electron: string;
      };
    };
  }
}
