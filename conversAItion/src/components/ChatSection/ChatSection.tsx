import React, { useRef, useEffect } from 'react';
import { Stack, Group, Text, Transition, Box, Center } from '@mantine/core';
import { chatSectionStyles, slideIn } from './styles';
import { MessageBubble } from './MessageBubble';
import { Message } from '../../types/conversation';
import { useUser } from "@clerk/clerk-react";
import { ModernInput } from '../InputArea/InputArea';

// props for the chat section component
interface ChatSectionProps {
  items: Message[];
  isConnected: boolean;
  isRecording: boolean;
  onStartRecording: (() => Promise<void>) | (() => void);
  onStopRecording: (() => Promise<void>) | (() => void);
  onDisconnect: (() => Promise<void>) | (() => void);
  onConnect: (() => Promise<void>) | (() => void);
  onSendMessage: (message: string) => Promise<void>;
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
  onSendMessage,
  clientCanvasRef,
  serverCanvasRef,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // auto scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [items]);

  // setting mounted state on load
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // connect before starting recording
  const handleRecordingStart = async () => {
    if (!isConnected) {
      await onConnect();
      return;
    }
    await onStartRecording();
  };

  const handleRecordingStop = async () => {
    await onStopRecording();
  };

  return (
    <Stack gap={0} style={{ position: 'relative', flex: 1, width: '100%' }}>
      {/* Chat messages */}
      <Box style={chatSectionStyles.chatArea}>
        {items.length === 0 ? (
          <Center style={{ height: '100%', flexDirection: 'column', gap: '1rem', width: '100%', padding: '0 1rem' }}>
            <Text size="xl" fw={600} c="dimmed">Hi {user?.firstName}!</Text>
            <Text size="sm" c="dimmed" style={{ maxWidth: '600px', textAlign: 'center' }}>
              Type a message or click the microphone button to start recording.
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

      {/* input and Recording controls */}
      <Box p="md" style={chatSectionStyles.recordingControls}>
        <Stack gap="md" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
          <Group justify="center" style={{ width: '100%' }}>

            {/* audio visualizer canvases (https://stackoverflow.com/questions/49061023/how-to-create-a-javascript-audio-visualizer) */}
            <Box visibleFrom="sm" style={{ position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)' }}>
              <Group gap="xl">
                <Box style={{ position: 'relative' }}>
                  <canvas 
                    ref={clientCanvasRef} 
                    height={40} 
                    width={100} 
                    style={chatSectionStyles.canvas}
                  />
                </Box>
                <Box style={{ position: 'relative' }}>
                  <canvas 
                    ref={serverCanvasRef} 
                    height={40} 
                    width={100} 
                    style={chatSectionStyles.canvas}
                  />
                </Box>
              </Group>
            </Box>

            {/* text input for messages with recording button */}
            <Box style={{ width: '100%' }}>
              <ModernInput
                isRecording={isRecording}
                onStartRecording={handleRecordingStart}
                onStopRecording={handleRecordingStop}
                onSendMessage={onSendMessage}
              />
            </Box>
          </Group>
        </Stack>
      </Box>
    </Stack>
  );
};
