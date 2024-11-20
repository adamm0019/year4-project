import { AppShell, Container, Group } from '@mantine/core';
import { RealtimeClient } from '@openai/realtime-api-beta';
import React, { useEffect, useRef } from 'react';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { WavRenderer } from '../utils/wav_renderer.js';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// Components
import { ChatSection } from '../components/ChatSection/ChatSection.js';
import { Header } from '../components/Header/Header.js';
import { AuthOverlay } from '../components/AuthOverlay/AuthOverlay.js';

// Hooks
import { useAudioRecording } from '../hooks/useAudioRecording.js';
import { useConversation } from '../hooks/useConversation.js';
import { useEventLogging } from '../hooks/useEventLogging.js';

const LOCAL_RELAY_SERVER_URL: string = import.meta.env.VITE_LOCAL_RELAY_SERVER_URL || '';

export const Home: React.FC = () => {


  // Start reference: https://github.com/openai/openai-realtime-console/ 

  // API Key handling
  const apiKey = LOCAL_RELAY_SERVER_URL
    ? ''
    : localStorage.getItem('tmp::voice_api_key') ||
      prompt('OpenAI API Key') ||
      '';

  if (apiKey !== '') {
    localStorage.setItem('tmp::voice_api_key', apiKey);
  }

  // Refs
  const wavRecorderRef = useRef<WavRecorder>(new WavRecorder({ sampleRate: 24000 }));
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(new WavStreamPlayer({ sampleRate: 24000 }));
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
  
  // End reference


  // Creting the react refs using useRef hooks to reference HTML canvas elements (audio visualisation) 
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);

  // Custom hooks
  const {
    isConnected,
    items,
    connect,
    disconnect,
    deleteItem,
    setItems
  } = useConversation({
    client: clientRef.current,
    wavRecorder: wavRecorderRef.current,
    wavStreamPlayer: wavStreamPlayerRef.current
  });

  const {
    isRecording,
    isInitialized,
    startRecording,
    stopRecording
  } = useAudioRecording({
    wavRecorder: wavRecorderRef.current,
    wavStreamPlayer: wavStreamPlayerRef.current,
    client: clientRef.current
  });

  const {
    realtimeEvents,
    addEvent,
    clearEvents
  } = useEventLogging();

  // State
  const [selectedLanguage, setSelectedLanguage] = React.useState('es');

  const resetAPIKey = React.useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  // Canvas rendering effect
  useEffect(() => {
    let isLoaded = true;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    const render = () => {
      if (isLoaded) {
        // Client canvas rendering
        if (clientCanvasRef.current) {
          const canvas = clientCanvasRef.current;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            if (!canvas.width || !canvas.height) {
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) }; // Creating a flot32Array from voice input
            
            WavRenderer.drawBars( // Drawing visualised audio input
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
            if (!canvas.width || !canvas.height) {
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            
            WavRenderer.drawBars( // Drawing visualised audio output (from the AI)
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

        window.requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  // Core setup effect
  useEffect(() => {
    const client = clientRef.current;

    // Event handling
    client.on('realtime.event', addEvent);
    client.on('error', (event: any) => {
      console.error('Client error:', event);
      addEvent(event);
    });

    return () => {
      client.reset();
    };
  }, [addEvent]);

  return (
    <AppShell // AppShell component from Mantine handling header styling
      header={{ height: 60 }}
      padding="md"
      style={{ position: 'relative' }}
    >
      <Header // Header component
        selectedLanguage={selectedLanguage}
        onLanguageChange={(value) => setSelectedLanguage(value || 'es')}
        onResetAPIKey={resetAPIKey}
        showSettings={!LOCAL_RELAY_SERVER_URL}
      />

      <AppShell.Main> {/* AppShell component for styling main content*/}
        <Container size="xl" px={0} style={{ position: 'relative' }}>
          <SignedIn> {/* Only showing the main content if the user is signed in */}
            <Group align="flex-start" grow>
              <ChatSection
                items={items}
                isConnected={isConnected}
                isRecording={isRecording}
                onStartRecording={startRecording}
                onStopRecording={stopRecording}
                onDisconnect={disconnect}
                onConnect={connect}
                clientCanvasRef={clientCanvasRef}
                serverCanvasRef={serverCanvasRef}
              />
            </Group>
          </SignedIn>
          <SignedOut>{/* If the user is signed out, showing the AuthOverlay */}
            <AuthOverlay />
          </SignedOut>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
};

export default Home;