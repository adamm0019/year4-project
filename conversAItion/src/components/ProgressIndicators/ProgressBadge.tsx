import { Box, RingProgress, Text, ThemeIcon, Tooltip, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconBrain, IconTarget, IconTrophy } from '@tabler/icons-react';

interface ProgressBadgeProps {
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  streak: number;
}

const levelColors = {
  Beginner: ['#4CAF50', '#81C784'],
  Intermediate: ['#2196F3', '#64B5F6'],
  Advanced: ['#9C27B0', '#BA68C8']
};

const MotionBox = motion(Box as any);

export const ProgressBadge: React.FC<ProgressBadgeProps> = ({ 
  level, 
  progress, 
  streak 
}) => {
  const [color1, color2] = levelColors[level];

  return (
    <MotionBox
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Tooltip
        label={`${progress}% complete in ${level} level • ${streak} day streak`}
        position="bottom"
        withArrow
      >
        <Group gap="xs">
          <RingProgress
            size={40}
            thickness={3}
            sections={[{ value: progress, color: color1 }]}
            label={
              <ThemeIcon 
                color="dark" 
                size={22} 
                radius="xl"
                style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}
              >
                <IconBrain size={14} />
              </ThemeIcon>
            }
          />
          
          {streak > 0 && (
            <Box>
              <Group gap={4}>
                <IconTrophy size={14} style={{ color: '#FFD700' }} />
                <Text size="xs" fw={500}>{streak}</Text>
              </Group>
            </Box>
          )}
        </Group>
      </Tooltip>
    </MotionBox>
  );
};