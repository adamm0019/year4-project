import React from 'react';
import { Stack, Group, Button, Text, Paper, Transition, Box, Loader } from '@mantine/core';
import { IconMicrophone, IconPlayerStop } from '@tabler/icons-react';
import { chatSectionStyles, pulseAnimation, slideIn } from './styles';
import { MessageBubble } from './MessageBubble';
import { EnhancedConversationItem } from '../../types/conversation';

interface ChatSectionProps {
  items: EnhancedConversationItem[];
  isConnected: boolean;
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onDisconnect: () => void;
  onConnect: () => void;
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  items,
  isConnected,
  isRecording,
  onStartRecording,
  onStopRecording,
  onDisconnect,
  onConnect,
  clientCanvasRef,
  serverCanvasRef,
}) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRecordingClick = React.useCallback(() => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  }, [isRecording, onStartRecording, onStopRecording]);

  return (
    <Stack gap={0} h="100%" style={{ position: 'relative' }}>
      {/* Connection controls */}
      <Box p="md" style={chatSectionStyles.connectionControls}>
        <Group justify="space-between" align="center">
          <Button
            variant={isConnected ? "light" : "filled"}
            color={isConnected ? "red" : "blue"}
            onClick={isConnected ? onDisconnect : onConnect}
            size="sm"
            radius="xl"
            style={{
              transition: 'all 0.3s ease',
              animation: isConnected ? `${pulseAnimation} 2s infinite` : 'none'
            }}
          >
            {isConnected ? "Disconnect" : "Connect"}
          </Button>
        </Group>
      </Box>

      {/* Chat messages */}
      <Box style={chatSectionStyles.chatArea}>
        <Stack gap="xl" px="xl">
          {items.map((item, index) => (
            <Transition
              key={item.id || index}
              mounted={mounted}
              transition="slide-up"
              duration={400}
              timingFunction="ease-out"
              exitDuration={200}
            >
              {(styles) => (
                <Box style={{ ...styles, animation: `${slideIn} 0.3s ease-out` }}>
                  <MessageBubble item={item} />
                </Box>
              )}
            </Transition>
          ))}
        </Stack>
      </Box>

      {/* Recording controls */}
      <Box p="md" style={chatSectionStyles.recordingControls}>
        <Stack gap="md">
          <Group justify="center">
            <Button
              size="lg"
              radius="xl"
              color={isRecording ? "red" : "blue"}
              variant={isRecording ? "filled" : "light"}
              onClick={handleRecordingClick}
              fullWidth
              style={{ 
                maxWidth: 400,
                transition: 'all 0.3s ease',
                transform: isRecording ? 'scale(1.02)' : 'scale(1)',
                animation: isRecording ? `${pulseAnimation} 2s infinite` : 'none'
              }}
            >
              <Group gap="xs" justify="center">
                {isRecording ? <IconPlayerStop size={20} /> : <IconMicrophone size={20} />}
                <span>{isRecording ? "Stop Recording" : "Start Recording"}</span>
              </Group>
            </Button>
          </Group>

          <Group justify="center" gap="xl">
            <Box style={{ position: 'relative' }}>
              <canvas 
                ref={clientCanvasRef} 
                height={40} 
                width={100} 
                style={chatSectionStyles.canvas}
              />
              {isRecording && (
                <Loader 
                  size="xs" 
                  color="blue" 
                  style={chatSectionStyles.loader}
                />
              )}
            </Box>
            <Box style={{ position: 'relative' }}>
              <canvas 
                ref={serverCanvasRef} 
                height={40} 
                width={100} 
                style={chatSectionStyles.canvas}
              />
              {isConnected && (
                <Loader 
                  size="xs" 
                  color="blue" 
                  style={chatSectionStyles.loader}
                />
              )}
            </Box>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
};
