import { createStyles } from '@mantine/styles';

export const useStyles = createStyles((theme) => ({
  appShell: {
    main: {
      background: theme.colors.dark[8],
    },
  },
  header: {
    background: 'rgba(26, 27, 30, 0.95)',
    borderBottom: '1px solid rgba(55, 58, 64, 0.5)',
    backdropFilter: 'blur(10px)',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, rgba(51, 154, 240, 0) 0%, rgba(51, 154, 240, 0.2) 50%, rgba(51, 154, 240, 0) 100%)',
    }
  },
  navbar: {
    background: 'transparent',
    border: 'none',
    padding: theme.spacing.md,
  },
  navbarContent: {
    background: 'rgba(26, 27, 30, 0.85)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(55, 58, 64, 0.5)',
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.md,
    height: '100%',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
    height: '100%',
  }
}));
