import React from 'react';
import { Box } from '@mantine/core';
import { useStyles } from './styles';

interface AudioVisualizerProps {
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export const AudioVisualiser: React.FC<AudioVisualizerProps> = ({
  clientCanvasRef,
  serverCanvasRef,
}) => {
  const { classes } = useStyles();

  return (
    <Box mb="md" h={60}>
      <Box h="45%" mb={4}>
        <canvas ref={clientCanvasRef} style={{ width: '100%', height: '100%' }} />
      </Box>
      <Box h="45%">
        <canvas ref={serverCanvasRef} style={{ width: '100%', height: '100%' }} />
      </Box>
    </Box>
  );
};