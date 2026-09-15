import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import useThemeStore from '../store/themeStore.js';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({ children }) {
  const theme = useThemeStore((s) => s.theme);
  const themePreset = useThemeStore((s) => s.themePreset);

  useEffect(() => {
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    }
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    
    // Set theme preset attribute
    document.documentElement.setAttribute('data-theme', themePreset);
  }, [theme, themePreset]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            style: {
              background: 'var(--toast-bg, #fff)',
              color: 'var(--toast-color, #363636)',
            },
          }}
        />
      </HelmetProvider>
    </QueryClientProvider>
  );
}