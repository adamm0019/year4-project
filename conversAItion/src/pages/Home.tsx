import { AppShell } from '@mantine/core';
import { RealtimeClient } from '@openai/realtime-api-beta';
import React, { useEffect, useRef, useState } from 'react';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { WavRenderer } from '../utils/wav_renderer';
import { notifications } from '@mantine/notifications';

// Components
import { ChatSection } from '../components/ChatSection/ChatSection.js';
import { Header } from '../components/Header/Header.js';
import { AuthOverlay } from '../components/AuthOverlay/AuthOverlay.js';

// Config
import { instructions } from '../utils/conversation_config';

const LOCAL_RELAY_SERVER_URL: string = import.meta.env.VITE_LOCAL_RELAY_SERVER_URL || '';

export const Home: React.FC = () => {
  // API Key handling
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ''
    : localStorage.getItem('tmp::voice_api_key') ||
      prompt('OpenAI API Key') ||
      '';

  if (apiKey !== '') {
    localStorage.setItem('tmp::voice_api_key', apiKey);
  }

  // State
  const [wavRecorder, setWavRecorder] = useState<WavRecorder | null>(null);
  const [wavStreamPlayer, setWavStreamPlayer] = useState<WavStreamPlayer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  // Refs
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient(
      LOCAL_RELAY_SERVER_URL
        ? { url: LOCAL_RELAY_SERVER_URL }
        : {
            apiKey: apiKey,
            dangerouslyAllowAPIKeyInBrowser: false,
          }
    )
  );
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Initialize audio components and request permissions
  const initializeAudio = async () => {
    try {
      // Create new instances
      const recorder = new WavRecorder({ sampleRate: 24000 });
      const player = new WavStreamPlayer({ sampleRate: 24000 });

      // Request microphone permissions and initialize recorder
      await recorder.requestPermission();
      await recorder.begin();
      await player.connect();

      setWavRecorder(recorder);
      setWavStreamPlayer(player);

      return true;
    } catch (error) {
      console.error('Audio initialization error:', error);
      notifications.show({
        title: 'Audio Error',
        message: 'Failed to initialize audio. Please check your microphone permissions.',
        color: 'red',
      });
      return false;
    }
  };

  const resetAPIKey = React.useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  const handleStartRecording = async () => {
    if (!isConnected) return;

    try {
      if (!wavRecorder || !wavStreamPlayer || !clientRef.current) {
        const initialized = await initializeAudio();
        if (!initialized) return;
      }

      // Start recording
      if (wavRecorder) {
        await wavRecorder.record((data: { mono: ArrayBuffer }) => {
          if (clientRef.current.isConnected()) {
            clientRef.current.appendInputAudio(new Int16Array(data.mono));
          }
        });
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Recording error:', error);
      notifications.show({
        title: 'Recording Error',
        message: 'Failed to start recording. Please try again.',
        color: 'red',
      });
    }
  };

  const handleStopRecording = async () => {
    if (!wavRecorder || !clientRef.current) return;

    try {
      if (wavRecorder.getStatus() === 'recording') {
        await wavRecorder.pause();
      }
      setIsRecording(false);

      if (clientRef.current.isConnected()) {
        await clientRef.current.createResponse();
      }
    } catch (error) {
      console.error('Stop recording error:', error);
      notifications.show({
        title: 'Recording Error',
        message: 'Failed to stop recording. Please try again.',
        color: 'red',
      });
    }
  };

  const connect = async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      // Initialize audio first
      const initialized = await initializeAudio();
      if (!initialized) return;

      // Connect to server
      await client.connect();

      // Initialize session
      await client.updateSession({
        instructions: instructions,
        input_audio_transcription: { 
          model: 'whisper-1',
        },
        voice: 'alloy',
        temperature: 0.7,
        model: 'gpt-4o-realtime-preview-2024-10-01',
        turn_detection: null // Force manual mode
      });

      setIsConnected(true);
      setItems(client.conversation.getItems());
    } catch (error) {
      console.error('Connection error:', error);
      setIsConnected(false);
      notifications.show({
        title: 'Connection Error',
        message: 'Failed to connect. Please try again.',
        color: 'red',
      });
    }
  };

  const disconnect = async () => {
    const client = clientRef.current;
    if (!client) return;

    try {
      // Stop recording if active
      if (isRecording && wavRecorder) {
        await wavRecorder.pause();
        setIsRecording(false);
      }

      // Clean up audio components
      if (wavRecorder) {
        await wavRecorder.end();
        setWavRecorder(null);
      }

      if (wavStreamPlayer) {
        await wavStreamPlayer.interrupt();
        setWavStreamPlayer(null);
      }

      // Disconnect client
      client.disconnect();
      setIsConnected(false);
      setItems([]);
    } catch (error) {
      console.error('Disconnect error:', error);
      notifications.show({
        title: 'Disconnect Error',
        message: 'Failed to disconnect properly. Please refresh the page.',
        color: 'red',
      });
    }
  };

  // Set up event handlers
  useEffect(() => {
    const client = clientRef.current;
    if (!client) return;

    const handleConversationUpdated = async ({ item, delta }: any) => {
      if (wavStreamPlayer && delta?.audio) {
        await wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }

      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }

      setItems(client.conversation.getItems());
    };

    client.on('conversation.updated', handleConversationUpdated);
    client.on('error', (error: any) => console.error('Client error:', error));

    return () => {
      client.off('conversation.updated', handleConversationUpdated);
      client.reset();
    };
  }, [wavStreamPlayer]);

  // Canvas rendering effect
  useEffect(() => {
    if (!wavRecorder || !wavStreamPlayer) return;

    const render = () => {
      // Client canvas rendering
      if (clientCanvasRef.current) {
        const canvas = clientCanvasRef.current;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = 100;
          canvas.height = 40;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const result = wavRecorder.recording
            ? wavRecorder.getFrequencies('voice')
            : { values: new Float32Array([0]) };
          
          WavRenderer.drawBars(
            canvas,
            ctx,
            result.values,
            '#1976d2',
            10,
            0,
            8
          );
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
          
          const result = wavStreamPlayer.analyser
            ? wavStreamPlayer.getFrequencies('voice')
            : { values: new Float32Array([0]) };
          
          WavRenderer.drawBars(
            canvas,
            ctx,
            result.values,
            '#2e7d32',
            10,
            0,
            8
          );
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [wavRecorder, wavStreamPlayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

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
        selectedLanguage={selectedLanguage}
        onLanguageChange={(value) => setSelectedLanguage(value || 'es')}
        onResetAPIKey={resetAPIKey}
        showSettings={!LOCAL_RELAY_SERVER_URL}
      />

      <AppShell.Main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', width: '100%' }}>
        <SignedIn>
          <ChatSection
            items={items}
            isConnected={isConnected}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onDisconnect={disconnect}
            onConnect={connect}
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
