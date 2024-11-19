import { createStyles } from '@mantine/styles';

export const useStyles = createStyles((theme) => ({
  container: {
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
  },
  visualizer: {
    height: '60px',
    marginBottom: theme.spacing.md,
  },
  canvas: {
    width: '100%',
    height: '45%',
    '&:first-of-type': {
      marginBottom: theme.spacing.xs,
    },
  },
}));