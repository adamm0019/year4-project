import { useState, useCallback, useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { RealtimeClient } from '@openai/realtime-api-beta';

interface UseAudioRecordingProps {
  wavRecorder: WavRecorder;
  wavStreamPlayer: WavStreamPlayer;
  client: RealtimeClient;
}

export const useAudioRecording = ({ wavRecorder, wavStreamPlayer, client }: UseAudioRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const audioDataRef = useRef<Int16Array[]>([]);
  const recordingStartTimeRef = useRef<number>(0);

  // Initialize audio recording
  const initializeRecording = useCallback(async () => {
    try {
      // Request microphone permissions first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone permission granted');

      if (wavRecorder.getStatus() === 'ended') {
        await wavRecorder.begin();
      }
      setIsInitialized(true);
      return true;
    } catch (error) {
      console.error('Audio initialization error:', error);
      notifications.show({
        title: 'Audio Error',
        message: 'Failed to initialize audio. Please check your microphone permissions.',
        color: 'red',
      });
      setIsInitialized(false);
      return false;
    }
  }, [wavRecorder]);

  // Safe pause function that checks status first
  const safePause = async () => {
    try {
      if (wavRecorder.getStatus() === 'recording') {
        await wavRecorder.pause();
      }
    } catch (error) {
      console.error('Safe pause error:', error);
    }
  };

  const startRecording = async () => {
    if (!client.isConnected()) {
      notifications.show({
        title: 'Error',
        message: 'Please connect first before recording',
        color: 'red',
      });
      return;
    }

    try {
      // Initialize if needed
      if (!isInitialized) {
        const initialized = await initializeRecording();
        if (!initialized) {
          throw new Error('Failed to initialize audio');
        }
      }

      // Reset audio data buffer
      audioDataRef.current = [];
      recordingStartTimeRef.current = Date.now();

      // Interrupt any current playback
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }

      // Start recording
      console.log('Starting recording...');
      await wavRecorder.record((data) => {
        if (client.isConnected()) {
          // Store audio data
          audioDataRef.current.push(data.mono);
          // Send to server
          client.appendInputAudio(data.mono);
        }
      });
      setIsRecording(true);
      
      console.log('Recording started:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: true,
        isConnected: client.isConnected(),
        startTime: new Date(recordingStartTimeRef.current).toISOString()
      });
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      await safePause();

      notifications.show({
        message: 'Failed to start recording',
        color: 'red',
        autoClose: 2000,
      });
    }
  };

  const stopRecording = async () => {
    if (!isRecording) return;

    try {
      const recordingDuration = Date.now() - recordingStartTimeRef.current;
      console.log('Stopping recording:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: true,
        isConnected: client.isConnected(),
        audioDataLength: audioDataRef.current.length,
        recordingDuration: `${recordingDuration}ms`
      });

      // Pause recording first
      await safePause();
      setIsRecording(false);

      // Create response if connected and we have audio data
      if (client.isConnected() && audioDataRef.current.length > 0) {
        console.log('Creating response with audio data');
        await client.createResponse();
      } else {
        console.warn('Not creating response:', {
          isConnected: client.isConnected(),
          hasAudioData: audioDataRef.current.length > 0
        });
      }

      // Clear audio data buffer
      audioDataRef.current = [];
      recordingStartTimeRef.current = 0;

      console.log('Recording stopped:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: false,
        isConnected: client.isConnected()
      });
    } catch (error) {
      console.error('Stop recording error:', error);
      setIsRecording(false);
      await safePause();

      notifications.show({
        message: 'Failed to stop recording',
        color: 'red',
        autoClose: 2000,
      });
    }
  };

  // Effect to handle connection state changes
  useEffect(() => {
    const checkConnection = () => {
      if (!client.isConnected() && isRecording) {
        console.log('Connection lost while recording, stopping...');
        stopRecording();
      }
    };

    // Check connection state periodically
    const interval = setInterval(checkConnection, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [client, isRecording]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          if (isRecording) {
            await safePause();
            setIsRecording(false);
          }
          setIsInitialized(false);
          audioDataRef.current = [];
          recordingStartTimeRef.current = 0;
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      cleanup();
    };
  }, []);

  return {
    isRecording,
    isInitialized,
    startRecording,
    stopRecording
  };
};
