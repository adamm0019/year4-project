import { createTheme, rem, MantineThemeComponents } from '@mantine/core';
import { CSSProperties } from 'react';

export const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'sm',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Paper: {
      defaultProps: {
        withBorder: true,
      }
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 6,
        type: 'auto',
      },
      styles: {
        scrollbar: {
          '&, &:hover': {
            background: 'transparent',
          },
          '&[data-orientation="vertical"] .mantine-ScrollArea-thumb': {
            backgroundColor: 'var(--mantine-color-dark-3)',
          },
        },
      },
    },
    Container: {
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-dark-7)',
        }
      }
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: 'var(--mantine-color-dark-8)',
        }
      }
    }
  } as MantineThemeComponents,
  other: {
    layoutPadding: rem(16),
    headerHeight: rem(60),
  },
});

// CSS classes for specific components
export const appClasses = {
  appShell: {
    background: 'var(--mantine-color-dark-8)',
  },
  header: {
    backgroundColor: 'var(--mantine-color-dark-8)',
    borderBottom: '1px solid var(--mantine-color-dark-5)',
    backdropFilter: 'blur(10px)',
  },
  navbar: {
    backgroundColor: 'var(--mantine-color-dark-8)',
    borderRight: '1px solid var(--mantine-color-dark-5)',
    backdropFilter: 'blur(10px)',
    
    '.mantine-Paper-root': {
      backgroundColor: 'var(--mantine-color-dark-7)',
    },
  },
  sidebarContent: {
    backgroundColor: 'transparent',
    border: '1px solid var(--mantine-color-dark-5)',
    height: '100%',
    
    'h3': {
      color: 'var(--mantine-color-white)',
      fontSize: 'var(--mantine-font-size-lg)',
      fontWeight: 500,
      marginBottom: 'var(--mantine-spacing-md)',
    },
  },
};

type GlobalStylesReturnType = {
  appShell: CSSProperties;
};

// Global styles hook that returns classes directly
export const useGlobalStyles = (): { classes: GlobalStylesReturnType } => ({
  classes: {
    appShell: {
      background: 'var(--mantine-color-dark-8)',
    } as CSSProperties,
  }
});
