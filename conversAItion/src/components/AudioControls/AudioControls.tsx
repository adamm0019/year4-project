import React from 'react';
import { Paper, Box, Group, Switch, Button } from '@mantine/core';
import { createStyles } from '@mantine/styles'
import { IconPlayerStop, IconMicrophone, IconX } from '@tabler/icons-react';
import { rem } from '@mantine/core';

// audiocontrols props
interface AudioControlsProps {
  isConnected: boolean;
  canPushToTalk: boolean;
  isRecording: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  onTurnEndTypeChange: (value: string) => Promise<void>;
  onDisconnect: () => Promise<void>;
  onConnect: () => Promise<void>;
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

// these are the styles used by the audio controls component
const useStyles = createStyles((theme: { colorScheme: string; colors: { dark: any[]; gray: any[]; }; spacing: { md: any; xs: any; }; }) => ({
  container: {
    borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
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
    justifyContent: 'space-between',
    alignItems: 'center',
  }
}));

export const AudioControls: React.FC<AudioControlsProps> = ({
  isConnected,
  canPushToTalk,
  isRecording,
  onStartRecording,
  onStopRecording,
  onTurnEndTypeChange,
  onDisconnect,
  onConnect,
  clientCanvasRef,
  serverCanvasRef,
}) => {
  const { classes } = useStyles();
  const [isChangingMode, setIsChangingMode] = React.useState(false);

  const handleModeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsChangingMode(true);
      await onTurnEndTypeChange(event.target.checked ? 'server_vad' : 'none');
    } finally {
      setIsChangingMode(false);
    }
  };

  return (
    <Paper withBorder p="md" radius={0} className={classes.container}>


      <Group className={classes.controls}>
        <Switch
          label="Voice Activity Detection"
          checked={!canPushToTalk}
          onChange={handleModeChange}
          size="md"
          disabled={!isConnected || isChangingMode}
        />
        <Group>
          {isConnected && canPushToTalk && (
            <Button
              variant={isRecording ? 'filled' : 'light'}
              color={isRecording ? 'red' : 'blue'}
              leftSection={isRecording ? 
                <IconPlayerStop style={{ width: rem(16), height: rem(16) }} /> : 
                <IconMicrophone style={{ width: rem(16), height: rem(16) }} />
              }
              onPointerDown={onStartRecording}
              onPointerUp={onStopRecording}
              onPointerLeave={onStopRecording}
              disabled={!isConnected || !canPushToTalk || isChangingMode}
            >
              {isRecording ? 'Release to Send' : 'Push to Talk'}
            </Button>
          )}
          <Button
            variant={isConnected ? 'light' : 'filled'}
            color={isConnected ? 'red' : 'blue'}
            leftSection={isConnected ? 
              <IconX style={{ width: rem(16), height: rem(16) }} /> : 
              <IconMicrophone style={{ width: rem(16), height: rem(16) }} />
            }
            onClick={isConnected ? onDisconnect : onConnect}
            disabled={isChangingMode}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </Button>
        </Group>
      </Group>
    </Paper>
  );
};
