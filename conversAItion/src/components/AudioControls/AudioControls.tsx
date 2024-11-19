import React from 'react';
import { Paper, Box, Group, Button } from '@mantine/core';
import { IconMicrophone, IconX } from '@tabler/icons-react';
import { rem } from '@mantine/core';
import { createStyles } from '@mantine/styles';

// Props interface
interface AudioControlsProps {
  isConnected: boolean;
  isRecording: boolean;
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<void>;
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

// Styles
const useStyles = createStyles((theme: { colorScheme: string; colors: { dark: any[]; gray: any[]; }; spacing: { md: any; xs: any; }; }) => ({
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
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }
}));

export const AudioControls: React.FC<AudioControlsProps> = ({
  isConnected,
  isRecording,
  onDisconnect,
  onConnect,
  clientCanvasRef,
  serverCanvasRef,
}) => {
  const { classes } = useStyles();

  const handleConnectionToggle = async () => {
    try {
      if (isConnected) {
        await onDisconnect();
      } else {
        await onConnect();
      }
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  return (
    <Paper withBorder p="md" radius={0} className={classes.container}>
      <Box className={classes.visualizer}>
        <AudioVisualiser
          clientCanvasRef={clientCanvasRef}
          serverCanvasRef={serverCanvasRef}
        />
      </Box>

      <Group className={classes.controls}>
        <Button
          variant={isConnected ? 'light' : 'filled'}
          color={isConnected ? 'red' : 'blue'}
          leftSection={isConnected ? 
            <IconX style={{ width: rem(16), height: rem(16) }} /> : 
            <IconMicrophone style={{ width: rem(16), height: rem(16) }} />
          }
          onClick={handleConnectionToggle}
        >
          {isConnected ? 'Disconnect' : 'Connect'}
        </Button>
      </Group>
    </Paper>
  );
};

// AudioVisualiser component
interface AudioVisualiserProps {
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export const AudioVisualiser: React.FC<AudioVisualiserProps> = ({
  clientCanvasRef,
  serverCanvasRef,
}) => {
  return (
    <>
      <Box mb={4} h="45%">
        <canvas ref={clientCanvasRef} style={{ width: '100%', height: '100%' }} />
      </Box>
      <Box h="45%">
        <canvas ref={serverCanvasRef} style={{ width: '100%', height: '100%' }} />
      </Box>
    </>
  );
};
