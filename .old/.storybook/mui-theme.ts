import { createTheme } from '@mui/material/styles';

const FamaTheme = {
  primary: '#3D5A80',
  secondary: '#EE6C4D',
  info: '#98C1D9',
  success: '#40916C',
  warning: '#FECF45',
  danger: '#E63946',
};

const LightTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'NunitoSans Regular, Futura, sans-serif',
  },

  palette: {
    mode: 'light',
    primary: {
      main: FamaTheme.primary,
    },
    info: {
      main: FamaTheme.info,
    },
    secondary: {
      main: FamaTheme.secondary,
    },
    success: {
      main: FamaTheme.success,
    },
    error: {
      main: FamaTheme.danger,
    },
    warning: {
      main: FamaTheme.warning,
    },
    background: {
      default: '#f6f6f7',
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
    MuiButtonBase: {
      defaultProps: {
        // The default props to change
        disableRipple: true, // No more ripple, on the whole application 💣!
      }
    },
  },
});

LightTheme.shadows[1] = '0 .5rem 1rem 0 rgba(44,51,73,.1)';
//LightTheme.shadows[6] =  '0 .5rem 1rem 0 rgba(44,51,73,.1)';

const DarkTheme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
    fontFamily: 'NunitoSans Regular, Futura, sans-serif',
  },
  palette: {
    mode: 'dark',
    primary: {
      main: FamaTheme.info,
    },
    info: {
      main: FamaTheme.primary,
    },
    secondary: {
      main: FamaTheme.secondary,
    },
    success: {
      main: FamaTheme.success,
    },
    error: {
      main: FamaTheme.danger,
    },
    warning: {
      main: FamaTheme.warning,
    },
    background: {
      // default: '#424242',
    },
  },
  components: {
    // Name of the component
    MuiButton: {
      defaultProps: {
        disableElevation: true
      }
    },
    MuiButtonBase: {
      defaultProps: {
        // The default props to change
        disableRipple: true, // No more ripple, on the whole application 💣!
      }
    },
  },
});

export const ThemeMap = {
  light: LightTheme,
  dark: DarkTheme,
};

export type settingThemeType = 'light' | 'dark';
