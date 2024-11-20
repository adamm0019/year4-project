import React, { useRef, useEffect } from 'react';
import { Stack, Group, Text, Transition, Box, Loader, Center, TextInput, ActionIcon } from '@mantine/core';
import { IconMicrophone, IconPlayerStop, IconPaperclip, IconArrowUp } from '@tabler/icons-react';
import { chatSectionStyles, pulseAnimation, slideIn } from './styles';
import { MessageBubble } from './MessageBubble';
import { EnhancedConversationItem } from '../../types/conversation';
import { useUser } from "@clerk/clerk-react";

interface ChatSectionProps {
  items: EnhancedConversationItem[];
  isConnected: boolean;
  isRecording: boolean;
  onStartRecording: (() => Promise<void>) | (() => void);
  onStopRecording: (() => Promise<void>) | (() => void);
  onDisconnect: (() => Promise<void>) | (() => void);
  onConnect: (() => Promise<void>) | (() => void);
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
  const [message, setMessage] = React.useState('');
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleRecordingClick = React.useCallback(async () => {
    if (!isConnected) {
      await onConnect();
      return;
    }

    if (isRecording) {
      await onStopRecording();
    } else {
      await onStartRecording();
    }
  }, [isConnected, isRecording, onStartRecording, onStopRecording, onConnect]);

  return (
    <Stack gap={0} style={{ position: 'relative', flex: 1, width: '100%' }}>
      {/* Chat messages */}
      <Box style={chatSectionStyles.chatArea}>
        {items.length === 0 ? (
          <Center style={{ height: '100%', flexDirection: 'column', gap: '1rem', width: '100%', padding: '0 1rem' }}>
            <Text size="xl" fw={600} c="dimmed">Hi, {user?.firstName}</Text>
            <Text size="sm" c="dimmed" style={{ maxWidth: '600px', textAlign: 'center' }}>
              Click the microphone button to start recording. Click again to stop and send your message. I'll help you practice your conversation skills.
            </Text>
          </Center>
        ) : (
          <Stack gap="xl" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
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
                  <Box style={{ ...styles, animation: `${slideIn} 0.3s ease-out`, width: '100%' }}>
                    <MessageBubble item={item} />
                  </Box>
                )}
              </Transition>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        )}
      </Box>

      {/* Input and Recording controls */}
      <Box p="md" style={chatSectionStyles.recordingControls}>
        <Stack gap="md" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Group justify="center" style={{ width: '100%' }}>
            {/* Audio visualizers */}
            <Box hiddenFrom="sm" style={{ width: '100%', marginBottom: '8px' }}>
              <Group gap="md" justify="center">
                <Box style={{ position: 'relative' }}>
                  <canvas 
                    ref={clientCanvasRef} 
                    height={40} 
                    width={80} 
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
                    width={80} 
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
            </Box>

            <Box visibleFrom="sm" style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)' }}>
              <Group gap="xl">
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
            </Box>

            {/* Input area */}
            <Box style={chatSectionStyles.inputWrapper}>
              <Group gap="xs" style={{ width: '100%' }}>
                <Box visibleFrom="sm">
                  <ActionIcon 
                    variant="subtle" 
                    color="gray" 
                    size="lg"
                    style={{ flexShrink: 0 }}
                  >
                    <IconPaperclip size={20} />
                  </ActionIcon>
                </Box>
                
                <TextInput
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.currentTarget.value)}
                  style={{ flex: 1 }}
                  rightSection={
                    <Group gap="xs">
                      <ActionIcon
                        variant="subtle"
                        color={isRecording ? "red" : "blue"}
                        onClick={handleRecordingClick}
                        size="lg"
                        style={{
                          animation: isRecording ? `${pulseAnimation} 2s infinite` : 'none',
                          cursor: 'pointer',
                          userSelect: 'none',
                          touchAction: 'none'
                        }}
                      >
                        {isRecording ? <IconPlayerStop size={20} /> : <IconMicrophone size={20} />}
                      </ActionIcon>
                      <ActionIcon
                        variant="filled"
                        color="blue"
                        size="lg"
                        disabled={!message.trim()}
                      >
                        <IconArrowUp size={20} />
                      </ActionIcon>
                    </Group>
                  }
                  rightSectionWidth={100}
                />
              </Group>
            </Box>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
};
