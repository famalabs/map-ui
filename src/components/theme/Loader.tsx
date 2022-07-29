import React from 'react';
import { CssBaseline, Theme, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

import moment from 'moment';

type ThemeLoaderProps = {
  loaded: () => void;
  theme: Theme;
  load: () => void | Promise<void>;
  lang?: string;
  children: any;
};

/*
 * Wrapper component for loading and providing theme on Material-UI
 */
export const ThemeLoader: React.FC<ThemeLoaderProps> = ({ loaded, load, theme, lang = 'en', children }) => {
  React.useEffect(() => {
    const waitLoad = load();
    if (waitLoad instanceof Promise)
      waitLoad.then(loaded).catch((err) => {
        console.log("Couldn't load theme");
        console.log(err);
      });
    else loaded();
  }, []);

  React.useMemo(() => {
    moment.locale(lang);
  }, [lang]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={lang}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          {children}
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};
