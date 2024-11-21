import { Paper, TextInput, ActionIcon, Group, Box } from '@mantine/core';
import { motion } from 'framer-motion';
import { 
  IconMicrophone, 
  IconPaperclip, 
  IconSend,
  IconPlayerStop 
} from '@tabler/icons-react';
import { useState } from 'react';

const MotionActionIcon = motion(ActionIcon as any);

interface ModernInputProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSendMessage: (message: string) => void;
}

export const ModernInput: React.FC<ModernInputProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onSendMessage
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <Paper
      p="md"
      style={(theme) => ({
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '35px',
        marginTop: 'auto',
      })}
    >
      <Group gap="apart xs">
        <TextInput
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          style={{ flex: 1 }}
          variant="unstyled"
        />
        <Group gap="xs">
          <ActionIcon variant="subtle" color="gray">
            <IconPaperclip size={20} />
          </ActionIcon>
          
          <MotionActionIcon
            variant="gradient"
            gradient={{ from: isRecording ? 'red' : 'blue', to: isRecording ? 'pink' : 'cyan' }}
            size="lg"
            radius="xl"
            onMouseDown={onStartRecording}
            onMouseUp={onStopRecording}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isRecording ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                <IconPlayerStop size={20} />
              </motion.div>
            ) : (
              <IconMicrophone size={20} />
            )}
          </MotionActionIcon>

          {message.trim() && (
            <MotionActionIcon
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              size="lg"
              radius="xl"
              onClick={handleSend}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <IconSend size={20} />
            </MotionActionIcon>
          )}
        </Group>
      </Group>
    </Paper>
  );
};