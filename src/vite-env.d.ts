/// <reference types="vite/client" />

declare global {
  interface Window {
    firebase?: {
      apps: unknown[];
      initializeApp: (config: Record<string, string | undefined>) => void;
      auth: () => unknown;
    };
  }
}

export {};
