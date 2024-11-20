import { useState, useCallback, useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { RealtimeClient } from '@openai/realtime-api-beta';

interface UseAudioRecordingProps {
  wavRecorder: WavRecorder | null;
  wavStreamPlayer: WavStreamPlayer | null;
  client: RealtimeClient;
}

export const useAudioRecording = ({ wavRecorder, wavStreamPlayer, client }: UseAudioRecordingProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio recording
  const initializeRecording = useCallback(async () => {
    if (!wavRecorder) {
      notifications.show({
        title: 'Error',
        message: 'Audio system not initialized. Please try again.',
        color: 'red',
      });
      return false;
    }

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
    if (!wavRecorder) return;

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

    if (!wavRecorder || !wavStreamPlayer) {
      notifications.show({
        title: 'Error',
        message: 'Audio system not initialized. Please try again.',
        color: 'red',
      });
      return;
    }

    try {
      // Initialize if needed
      if (!isInitialized) {
        const initialized = await initializeRecording();
        if (!initialized) {
          throw new Error('Failed to initialize audio recording');
        }
      }

      // Interrupt any current playback
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }

      // Ensure we're not recording first
      await safePause();

      // Start recording
      await wavRecorder.record((data: { mono: ArrayBuffer }) => {
        if (client.isConnected()) {
          client.appendInputAudio(new Int16Array(data.mono));
        }
      });
      setIsRecording(true);
      
      console.log('Recording started:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: true,
        canPushToTalk,
        isConnected: client.isConnected()
      });
    } catch (error) {
      console.error('Recording error:', error);
      setIsRecording(false);
      
      // Try to cleanup
      await safePause();

      notifications.show({
        message: 'Failed to start recording',
        color: 'red',
        autoClose: 2000,
      });
    }
  };

  const stopRecording = async () => {
    if (!isRecording || !wavRecorder) return;

    try {
      console.log('Stopping recording:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: true,
        isConnected: client.isConnected()
      });

      // Pause recording first
      await safePause();
      setIsRecording(false);

      // Create response if connected and in push-to-talk mode
      if (client.isConnected() && canPushToTalk) {
        await client.createResponse();
      }

      console.log('Recording stopped:', {
        recorderStatus: wavRecorder.getStatus(),
        isRecording: false,
        canPushToTalk,
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

  const changeTurnEndType = useCallback(async (value: string) => {
    if (!wavRecorder) return;

    try {
      console.log('Changing turn end type:', {
        newValue: value,
        currentRecorderStatus: wavRecorder.getStatus(),
        isConnected: client.isConnected()
      });

      // Update push-to-talk state first
      const newPushToTalkState = value === 'none';
      setCanPushToTalk(newPushToTalkState);

      // If currently recording and switching to push-to-talk, stop recording
      if (isRecording && newPushToTalkState) {
        await stopRecording();
      }

      // Update client session
      await client.updateSession({
        turn_detection: value === 'none' ? null : { type: 'server_vad' },
      });

      // If switching to VAD mode
      if (value === 'server_vad') {
        if (!client.isConnected()) {
          throw new Error('Client must be connected for VAD mode');
        }

        // Initialize if needed
        if (!isInitialized) {
          const initialized = await initializeRecording();
          if (!initialized) {
            throw new Error('Failed to initialize audio for VAD mode');
          }
        }

        // Start VAD recording
        if (wavRecorder.getStatus() === 'ended') {
          await wavRecorder.begin();
        }

        // Only start recording if not already recording
        if (!isRecording) {
          await wavRecorder.record((data: { mono: ArrayBuffer }) => {
            if (client.isConnected()) {
              client.appendInputAudio(new Int16Array(data.mono));
            }
          });
          setIsRecording(true);
        }
      }
      
      console.log('Turn end type changed:', {
        value,
        canPushToTalk: newPushToTalkState,
        recorderStatus: wavRecorder.getStatus(),
        isConnected: client.isConnected()
      });

    } catch (error) {
      console.error('Error changing turn end type:', error);
      
      // Reset to push-to-talk mode on error
      setCanPushToTalk(true);
      setIsRecording(false);
      await safePause();
      
      notifications.show({
        title: 'Error',
        message: 'Failed to change voice detection mode. Reverting to push-to-talk.',
        color: 'red',
      });

      // Try to reset client session
      try {
        await client.updateSession({
          turn_detection: null
        });
      } catch (sessionError) {
        console.error('Failed to reset session:', sessionError);
      }
    }
  }, [wavRecorder, client, isInitialized, initializeRecording, isRecording, stopRecording]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          if (isRecording) {
            await stopRecording();
          } else {
            await safePause();
          }
          setIsRecording(false);
          setIsInitialized(false);
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      cleanup();
    };
  }, [isRecording, stopRecording]);

  return {
    isRecording,
    canPushToTalk,
    isInitialized,
    startRecording,
    stopRecording,
    changeTurnEndType,
    initializeRecording,
  };
};