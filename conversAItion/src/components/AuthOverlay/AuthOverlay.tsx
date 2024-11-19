import { Box, Paper, Text, Button, Stack, Space } from '@mantine/core';
import { createStyles } from '@mantine/styles'
import { SignInButton } from "@clerk/clerk-react";

const useStyles = createStyles((theme: { radius: { lg: any; md: any; }; white: any; spacing: { xs: any; lg: any; }; colors: { gray: any[]; }; }) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    borderRadius: theme.radius.lg,
    transform: 'translateY(-10%)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-11%)',
      boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.45)',
    },
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    textAlign: 'center',
    color: theme.white,
    marginBottom: theme.spacing.xs,
    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  description: {
    textAlign: 'center',
    color: theme.colors.gray[3],
    fontSize: '16px',
    marginBottom: theme.spacing.lg,
  },
  button: {
    background: 'linear-gradient(135deg, #2196F3 0%, #1E88E5 100%)',
    border: 0,
    borderRadius: theme.radius.md,
    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
    color: theme.white,
    height: 48,
    fontSize: '16px',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    '&:hover': {
      background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 100%)',
      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
      transform: 'translateY(-2px)',
    },
  },
}));

export const AuthOverlay = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.overlay}>
      <Paper p="xl" className={classes.card}>
        <Stack gap="md">
          <Text className={classes.title}>
            Sign in to use ConversAItion
          </Text>
          <Space></Space>
          <Text className={classes.description}>
            Create an account or sign in to access the chat functionality
          </Text>
          <SignInButton mode="modal">
            <Button fullWidth className={classes.button}>
              Sign In / Sign Up
            </Button>
          </SignInButton>
        </Stack>
      </Paper>
    </Box>
  );
};