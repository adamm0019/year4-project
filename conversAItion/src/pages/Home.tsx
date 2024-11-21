import { AppShell } from '@mantine/core';
import React, { useRef, useState } from 'react';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { notifications } from '@mantine/notifications';
import { useConversation, Role } from '@11labs/react';

// Components
import { ChatSection } from '../components/ChatSection/ChatSection.js';
import { Header } from '../components/Header/Header.js';
import { AuthOverlay } from '../components/AuthOverlay/AuthOverlay.js';

// Types
import { Message } from '../types/conversation';

const ELEVEN_LABS_SERVER_URL = import.meta.env.VITE_ELEVEN_LABS_SERVER_URL;

export const Home: React.FC = () => {
  // State
  const [items, setItems] = useState<Message[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('alloy');
  const [isRecording, setIsRecording] = useState(false);

  // Refs
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setItems([]);
    },
    onMessage: (props: { message: string; source: Role }) => {
      const newMessage: Message = {
        text: props.message,
        role: props.source,
        timestamp: Date.now(),
        created_at: new Date().toISOString(),
        final: true
      };

      setItems(prevItems => [...prevItems, newMessage]);
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to communicate with AI. Please try again.',
        color: 'red',
      });
    }
  });

  const getSignedUrl = async () => {
    try {
      const response = await fetch(`${ELEVEN_LABS_SERVER_URL}/api/get-signed-url`);
      if (!response.ok) {
        throw new Error('Failed to get signed URL');
      }
      const data = await response.json();
      return data.signedUrl;
    } catch (error) {
      console.error('Error getting signed URL:', error);
      notifications.show({
        title: 'Connection Error',
        message: 'Failed to connect to ElevenLabs. Please try again.',
        color: 'red',
      });
      return null;
    }
  };

  const startConversation = async () => {
    try {
      // Get microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Get signed URL
      const signedUrl = await getSignedUrl();
      if (!signedUrl) return false;

      // Start session with signed URL
      await conversation.startSession({
        signedUrl,
        origin: window.location.origin
      });
      
      return true;
    } catch (error) {
      console.error('Failed to start conversation:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to start conversation. Please check your microphone permissions.',
        color: 'red',
      });
      return false;
    }
  };

  const handleStartRecording = async () => {
    if (!conversation.status) {
      const started = await startConversation();
      if (!started) return;
    }
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!conversation.status) {
      const started = await startConversation();
      if (!started) return;
    }

    const newMessage: Message = {
      text: message,
      role: 'user',
      timestamp: Date.now(),
      created_at: new Date().toISOString(),
      final: true
    };

    setItems(prevItems => [...prevItems, newMessage]);
  };

  const handleDisconnect = async () => {
    await conversation.endSession();
    setItems([]);
  };

  const handleConnect = async () => {
    await startConversation();
  };

  // Set up audio visualization
  React.useEffect(() => {
    if (!conversation.status) return;

    const render = () => {
      // Client canvas rendering
      if (clientCanvasRef.current) {
        const canvas = clientCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = 100;
          canvas.height = 40;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const frequencies = conversation.getInputByteFrequencyData();
          if (frequencies) {
            // Draw input frequencies
            ctx.fillStyle = '#1976d2';
            const barWidth = canvas.width / frequencies.length;
            frequencies.forEach((value, i) => {
              const height = (value / 255) * canvas.height;
              ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
            });
          }
        }
      }

      // Server canvas rendering
      if (serverCanvasRef.current) {
        const canvas = serverCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = 100;
          canvas.height = 40;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const frequencies = conversation.getOutputByteFrequencyData();
          if (frequencies) {
            // Draw output frequencies
            ctx.fillStyle = '#2e7d32';
            const barWidth = canvas.width / frequencies.length;
            frequencies.forEach((value, i) => {
              const height = (value / 255) * canvas.height;
              ctx.fillRect(i * barWidth, canvas.height - height, barWidth - 1, height);
            });
          }
        }
      }

      requestAnimationFrame(render);
    };

    render();
  }, [conversation.status]);

  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
      style={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Header
        selectedVoice={selectedVoice}
        onVoiceChange={(value) => setSelectedVoice(value || 'alloy')}
        onResetAPIKey={() => {}} // Not needed for ElevenLabs
        showSettings={false}
      />

      <AppShell.Main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', width: '100%' }}>
        <SignedIn>
          <ChatSection
            items={items}
            isConnected={conversation.status === 'connected'}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onDisconnect={handleDisconnect}
            onConnect={handleConnect}
            onSendMessage={handleSendMessage}
            clientCanvasRef={clientCanvasRef}
            serverCanvasRef={serverCanvasRef}
          />
        </SignedIn>
        <SignedOut>
          <AuthOverlay />
        </SignedOut>
      </AppShell.Main>
    </AppShell>
  );
};

export default Home;
