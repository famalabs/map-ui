import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import React from 'react';

interface ThemeLoaderProps {
  loaded: () => void;
  theme: Theme;
  load: () => void | Promise<void>;
  lang?: string;
  children: any;
};

/*
 * Wrapper component for loading and providing theme on Material-UI
 */
export const ThemeLoader: React.FC<ThemeLoaderProps> = ({ loaded, load, theme, children }) => {
  React.useEffect(() => {
    const waitLoad = load();
    if (waitLoad instanceof Promise)
      waitLoad.then(loaded).catch((err) => {
        console.log("Couldn't load theme");
        console.log(err);
      });
    else loaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
};
