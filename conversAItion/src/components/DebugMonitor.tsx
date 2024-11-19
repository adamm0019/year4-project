import React from 'react';
import { Paper, Text, Stack } from '@mantine/core';

interface DebugMonitorProps {
  isConnected: boolean;
  canPushToTalk: boolean;
  isRecording: boolean;
  isInitialized: boolean;
  recorderStatus: string;
}

export const DebugMonitor: React.FC<DebugMonitorProps> = ({
  isConnected,
  canPushToTalk,
  isRecording,
  isInitialized,
  recorderStatus
}) => {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Paper 
      withBorder 
      p="xs" 
      style={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        zIndex: 1000,
        opacity: 0.8,
        '&:hover': { opacity: 1 }
      }}
    >
      <Stack>
        <Text size="xs">Connected: {String(isConnected)}</Text>
        <Text size="xs">Push to Talk: {String(canPushToTalk)}</Text>
        <Text size="xs">Recording: {String(isRecording)}</Text>
        <Text size="xs">Initialized: {String(isInitialized)}</Text>
        <Text size="xs">Recorder Status: {recorderStatus}</Text>
      </Stack>
    </Paper>
  );
};