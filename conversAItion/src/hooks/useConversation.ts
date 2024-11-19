import { useState, useCallback, useRef, useEffect } from 'react';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { notifications } from '@mantine/notifications';
import { WavRecorder, WavStreamPlayer } from '../lib/wavtools/index.js';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { EnhancedConversationItem } from '../types/conversation';

interface UseConversationProps {
  client: RealtimeClient;
  wavRecorder: WavRecorder;
  wavStreamPlayer: WavStreamPlayer;
}

export const useConversation = ({ client, wavRecorder, wavStreamPlayer }: UseConversationProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [items, setItems] = useState<EnhancedConversationItem[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const connectionTimeoutRef = useRef<NodeJS.Timeout>();
  const hasInitializedRef = useRef(false);

  // Transform ItemType to EnhancedConversationItem
  const enhanceItem = (item: ItemType): EnhancedConversationItem => {
    return {
      ...item,
      created_at: new Date().toISOString(),
      timestamp: Date.now(),
      object: item.object || 'conversation.item'
    } as EnhancedConversationItem;
  };

  // Listen for connection events
  useEffect(() => {
    if (!client) {
      console.warn('Client is not initialized');
      return;
    }

    const handleSessionCreated = () => {
      console.log('Session created, setting connected state');
      setIsConnected(true);
      setIsConnecting(false);
      hasInitializedRef.current = true;
    };

    const handleSessionUpdated = () => {
      if (hasInitializedRef.current) {
        console.log('Session updated, maintaining connected state');
        setIsConnected(true);
        setIsConnecting(false);
      }
    };

    const handleSessionClosed = () => {
      console.log('Session closed, resetting state');
      setIsConnected(false);
      setIsConnecting(false);
      hasInitializedRef.current = false;
    };

    const handleError = (error: any) => {
      console.error('Session error:', error);
      setIsConnected(false);
      setIsConnecting(false);
      hasInitializedRef.current = false;
      
      notifications.show({
        title: 'Connection Error',
        message: 'An error occurred with the connection. Please try reconnecting.',
        color: 'red',
      });
    };

    try {
      client.on('session.created', handleSessionCreated);
      client.on('session.updated', handleSessionUpdated);
      client.on('session.closed', handleSessionClosed);
      client.on('error', handleError);

      return () => {
        try {
          client.off('session.created', handleSessionCreated);
          client.off('session.updated', handleSessionUpdated);
          client.off('session.closed', handleSessionClosed);
          client.off('error', handleError);
        } catch (error) {
          console.error('Error removing event listeners:', error);
        }
      };
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }, [client]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const cleanup = async () => {
        try {
          await disconnect();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
      };
      cleanup();
    };
  }, []);

  const clearConnectionTimeout = () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = undefined;
    }
  };

  const connect = async () => {
    if (isConnecting || !client) return;
    
    try {
      console.log('Starting connection...');
      setIsConnecting(true);
      clearConnectionTimeout();
      hasInitializedRef.current = false;

      // Initialize WavStreamPlayer first
      console.log('Initializing WavStreamPlayer...');
      await wavStreamPlayer.connect();

      // Set up connection timeout
      const connectionPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) => {
        connectionTimeoutRef.current = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 10000); // 10 second timeout
      });

      // Wait for connection with timeout
      console.log('Connecting to server...');
      await Promise.race([connectionPromise, timeoutPromise]);
      clearConnectionTimeout();

      // Add a connection verification step
      if (!client.isConnected()) {
        throw new Error('Client reports as not connected after connection attempt');
      }

      // Wait a moment and verify connection is still active
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (client.isConnected()) {
        console.log('Connection established, initializing session...');
        
        // Initialize session with all required settings
        await client.updateSession({
          instructions: 'You are a helpful language learning assistant. Keep your responses concise.',
          input_audio_transcription: { model: 'whisper-1' },
          voice: 'alloy',
          temperature: 0.7,
        });

        console.log('Session initialized successfully');
        notifications.show({
          title: 'Connected',
          message: 'Successfully connected to the language learning service',
          color: 'green',
        });
      } else {
        throw new Error('Connection lost during initialization');
      }
    } catch (error) {
      console.error('Connection error:', error);
      
      // Ensure state is reset
      setIsConnected(false);
      setIsConnecting(false);
      hasInitializedRef.current = false;
      clearConnectionTimeout();

      // Clean up failed connection attempts
      try {
        await safeDisconnect();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      notifications.show({
        title: 'Connection Error',
        message: 'Failed to connect to the service. Please try again.',
        color: 'red',
      });

      throw error;
    }
  };

  // Force cleanup of WavRecorder properties
  const forceCleanupWavRecorder = (recorder: WavRecorder) => {
    try {
      if (recorder.stream) {
        try {
          const tracks = recorder.stream.getTracks();
          if (tracks && Array.isArray(tracks)) {
            tracks.forEach(track => {
              try {
                track.stop();
              } catch (e) {
                console.error('Error stopping track:', e);
              }
            });
          }
        } catch (e) {
          console.error('Error accessing tracks:', e);
        }
        recorder.stream = null;
      }
      
      recorder.processor = null;
      recorder.source = null;
      recorder.node = null;
      recorder.recording = false;
    } catch (e) {
      console.error('Error in force cleanup:', e);
    }
  };

  // Safe cleanup of WavRecorder
  const cleanupWavRecorder = async () => {
    if (!wavRecorder) return;

    try {
      // First force stop any active tracks and clean up properties
      forceCleanupWavRecorder(wavRecorder);

      // Then try to pause if still recording
      try {
        if (wavRecorder.getStatus() === 'recording') {
          await wavRecorder.pause();
        }
      } catch (e) {
        console.error('Error pausing recorder:', e);
      }

      // Finally try to end
      try {
        if (wavRecorder.getStatus() !== 'ended') {
          await wavRecorder.end();
        }
      } catch (e) {
        console.error('Error ending recorder:', e);
        // Ensure properties are cleaned up even if end fails
        forceCleanupWavRecorder(wavRecorder);
      }
    } catch (error) {
      console.error('WavRecorder cleanup error:', error);
      // Final attempt at cleanup
      forceCleanupWavRecorder(wavRecorder);
    }
  };

  // Safe cleanup of all components
  const safeDisconnect = async () => {
    console.log('Starting safe disconnect...');
    
    // Clean up WavRecorder first
    await cleanupWavRecorder();

    // Clean up WavStreamPlayer
    try {
      if (wavStreamPlayer) {
        await wavStreamPlayer.interrupt();
      }
    } catch (error) {
      console.error('WavStreamPlayer cleanup error:', error);
    }

    // Clean up client last
    try {
      if (client) {
        client.disconnect();
      }
    } catch (error) {
      console.error('Client cleanup error:', error);
    }

    console.log('Safe disconnect completed');
  };

  const disconnect = async () => {
    try {
      console.log('Starting disconnect...');
      
      // Update state first to prevent any new operations
      setIsConnected(false);
      setIsConnecting(false);
      hasInitializedRef.current = false;
      clearConnectionTimeout();

      // Perform safe disconnection
      await safeDisconnect();
      
      console.log('Disconnect completed');
    } catch (error) {
      console.error('Disconnect error:', error);
      // Even if there's an error, ensure state is reset
      setIsConnected(false);
      setIsConnecting(false);
      hasInitializedRef.current = false;
    }
  };

  const deleteItem = useCallback(async (id: string) => {
    if (!client) return;
    
    try {
      await client.deleteItem(id);
    } catch (error) {
      console.error('Delete item error:', error);
    }
  }, [client]);

  // Update items with enhanced conversation items
  const updateItems = useCallback((newItems: ItemType[]) => {
    console.log('Updating conversation items:', newItems);
    const enhancedItems = newItems.map(enhanceItem);
    setItems(enhancedItems);
  }, []);

  return {
    isConnected,
    isConnecting,
    items,
    connect,
    disconnect,
    deleteItem,
    setItems: updateItems,
  };
};
