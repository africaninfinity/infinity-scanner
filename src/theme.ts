export const themeTokens = {
  light: {
    colors: {
      background: '#f5f7fb',
      card: '#ffffff',
      text: '#121a2a',
      muted: '#667085',
      primary: '#3b82f6',
      accent: '#60a5fa',
      success: '#22c55e',
      warning: '#f59e0b',
      border: '#dfe6ef',
      overlay: 'rgba(15, 23, 42, 0.55)',
      shadow: 'rgba(15, 23, 42, 0.14)',
    },
  },
  dark: {
    colors: {
      background: '#0b1220',
      card: '#121d2d',
      text: '#e5edf7',
      muted: '#9aa8ba',
      primary: '#60a5fa',
      accent: '#93c5fd',
      success: '#34d399',
      warning: '#fbbf24',
      border: '#243244',
      overlay: 'rgba(2, 6, 23, 0.6)',
      shadow: 'rgba(0, 0, 0, 0.24)',
    },
  },
} as const;

export const getTheme = (theme: 'light' | 'dark') => themeTokens[theme];
