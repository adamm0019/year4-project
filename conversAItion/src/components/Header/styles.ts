import { rem } from '@mantine/core';

export const headerStyles = {
  header: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    backdropFilter: 'blur(10px)',
    background: 'rgba(26, 27, 30, 0.85)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  navbarInner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: rem(60),
    padding: `${rem(4)} ${rem(16)}`,
  },
  actionButton: {
    '&:hover': {
      backgroundColor: 'var(--mantine-color-dark-5)',
    },
  },
};
