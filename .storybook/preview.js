import { ThemeMap } from './mui-theme';
import { ThemeLoader } from '../src/components/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  layout: 'centered',
};

export const decorators = [
  (Story, context) => (
    <ThemeLoader
      theme={ThemeMap[context.globals.theme]}
      load={() => null}
      loaded={() => null}
      lang={context.globals.lang}
    >
      <Story />
    </ThemeLoader>
  ),
];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      // array of plain string values or MenuItem shape (see below)
      items: ['light', 'dark'],
    },
  },
  lang: {
    name: 'Language',
    description: 'Language',
    defaultValue: 'en',
    toolbar: {
      // array of plain string values or MenuItem shape (see below)
      items: ['en', 'it'],
    },
  },
};
