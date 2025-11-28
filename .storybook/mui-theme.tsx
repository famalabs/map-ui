import {
  Components,
  CssVarsTheme,
  PaletteOptions,
  Theme,
  TypographyVariantsOptions,
  createTheme,
} from '@mui/material/styles';
import { SquareCheck, SquareIcon } from 'lucide-react';

/* --- (!Important!) Declare custom component variants here --- */
// declare module "@mui/material/Button" {
//   interface ButtonPropsVariantOverrides {
//     active: true;
//     unactive: true;
//     customOutline: true;
//     ghost: true;
//   }
// }

/* --------------- THEME CONFIGURATION ----------------- */

export const FamaTheme = {
  primary: {
    main: '#3D5A80',
    light: '#8a6eff',
    dark: '#ffffff',
    contrastText: '#ffffff',
  },

  secondary: {
    main: '#EE6C4D',
    light: '#EE6C4D',
    dark: '#FFF3E8',
    contrastText: '#000000',
  },

  info: {
    main: '#98C1D9',
    light: '#CFEFFB',
    dark: '#A3CAF0',
    contrastText: '#000000',
  },

  success: {
    main: '#40916C',
    light: '#6abf99',
    dark: '#7FD1A8',
    contrastText: '#ffffff',
  },

  warning: {
    main: '#FECF45',
    light: '#fffd77',
    dark: '#FECF45',
    contrastText: '#000000',
  },

  danger: {
    main: '#E63946',
    light: '#ff6f70',
    dark: '#FF7A7C',
    contrastText: '#ffffff',
  },

  card_primary: '#ffffff',
  card_secondary: '#f3f6fd',

  border_light: '#b6c0da',
  border_medium: '#e0e3eb',
  border_strong: '#f3f6fd',

  button_active: '#7265fd',
  button_unactive: '#f3f6fd',

  button_text_active: '#ffffff',
  button_text_unactive: '#2c3349',

  text_strong: '#2c3349',
  text_medium: '#4d576b',
  text_light: '#7b8599',

  row_hover: '#f3f6fd',
};

/* Custom Components */

const CustomizedComponents: Components<Omit<Theme, 'palette' | 'components'> & CssVarsTheme> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 99,
        padding: '4px 14px',
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '4px 10px',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        boxShadow: 'none',
        border: 'none',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        boxShadow: 'none',
        border: 'none',
      },
    },
  },
  MuiFormControl: {
    styleOverrides: {
      root: {
        marginTop: '8px',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        border: 'none',
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: '36px',
        color: '#2c3349',
      },
    },
  },
  MuiList: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      colorInherit: '#2c3349',
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        '&:hover': {
          boxShadow: 'rgba(25, 25, 25, 0.09) 0px 0px 0px 3px',
        },
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        border: '1px solid rgba(25, 25, 25, 0.15)',
        padding: '4px',
        borderRadius: '12px',
        boxShadow: 'rgba(25, 25, 25, 0.09) 0px 0px 0px 3px',
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      popper: {
        border: '1px solid rgba(25, 25, 25, 0.15)',
        padding: '4px',
        borderRadius: '12px',
        boxShadow: 'rgba(25, 25, 25, 0.09) 0px 0px 0px 3px',
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
  MuiInput: {
    styleOverrides: {
      root: {
        borderRadius: '10px',
      },
    },
  },
  MuiCheckbox: {
    defaultProps: {
      checkedIcon: <SquareCheck size={22} />,
      icon: <SquareIcon size={22} />,
    },
  },
};

/* Custom Typography */

const LightTypography: TypographyVariantsOptions = {
  button: {
    textTransform: 'none',
  },
  h6: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  h5: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  h4: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  h1: {
    fontSize: 36,
    fontWeight: 'bold',
  },
};

const DarkTypography: TypographyVariantsOptions = {
  button: {
    textTransform: 'none',
  },
  h6: {
    fontSize: 16,
    color: 'white',
  },
  h4: {
    color: 'white',
  },
};

const LightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#146EF5',
  },
  secondary: {
    main: '#146EF5',
  },
  success: {
    main: FamaTheme.success.main,
  },
  error: {
    main: FamaTheme.danger.main,
  },
  warning: {
    main: FamaTheme.secondary.light,
  },
  background: {
    default: '#F4F7FE',
    paper: '#ffffff',
  },
  divider: 'rgba(25, 25, 25, 0.08)',
  text: {
    primary: FamaTheme.text_strong,
    secondary: FamaTheme.text_medium,
  },
};

const DarkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: FamaTheme.primary.dark,
  },
  info: {
    main: FamaTheme.info.dark,
  },
  secondary: {
    main: FamaTheme.secondary.dark,
  },
  success: {
    main: FamaTheme.success.dark,
  },
  error: {
    main: FamaTheme.danger.dark,
  },
  warning: {
    main: FamaTheme.warning.dark,
  },
  background: {
    default: '#0A1437',
    paper: '#101C44',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#EFF3FB',
  },
  divider: '#FFFFFF30',
};

/* --------------- THEME CREATION ----------------- */

const LightTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: CustomizedComponents,

  typography: LightTypography,

  palette: LightPalette,
});

LightTheme.shadows[1] = '0 .5rem 1rem 0 rgba(44,51,73,.1)';

const DarkTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: CustomizedComponents,
  typography: DarkTypography,
  palette: DarkPalette,
});

export const ThemeMap = {
  light: LightTheme,
  dark: DarkTheme,
};

export type settingThemeType = 'light' | 'dark';
