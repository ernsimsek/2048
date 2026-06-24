export const appParams = {
  appId: import.meta.env.VITE_BASE44_APP_ID || 'local-dev',
  token: null,
  fromUrl: typeof window !== 'undefined' ? window.location.href : '',
  functionsVersion: import.meta.env.VITE_BASE44_FUNCTIONS_VERSION || 'v1',
  appBaseUrl: import.meta.env.VITE_BASE44_APP_BASE_URL || 'http://localhost:5173',
};
