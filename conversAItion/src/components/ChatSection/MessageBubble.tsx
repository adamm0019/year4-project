import React from 'react';
import { Box, Text, Avatar, Group } from '@mantine/core';
import { motion } from 'framer-motion';
import { IconUser, IconRobot } from '@tabler/icons-react';
import { chatSectionStyles, slideIn } from './styles';
import { Message } from '../../types/conversation';

interface MessageBubbleProps {
  item: Message;
}

const MotionBox = motion(Box as any);

// handles the display of individual chat messages with animations and styling
// im using framer-motion for smooth animations when messages appear and on hover

// animation settings for the message bubble entrance and hover effects
const bubbleVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20
    }
  },
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.2
    }
  }
};

// animation for the typing indicator dots
const typingIndicator = {
  animate: {
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// formats the timestamp into a readable time string (https://stackoverflow.com/questions/40526102/how-do-you-format-a-date-time-in-typescript)
const formatTimestamp = (timestamp: string | number) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    console.error('Error formatting timestamp:', e);
    return '';
  }
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ item }) => {
  const isAssistant = item.role === 'ai';

  const messageContainerStyle = {
    ...chatSectionStyles.messageContainer,
    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
    justifyContent: isAssistant ? 'flex-start' : 'flex-end',
    width: 'auto',
  };

  const bubbleStyle = {
    ...chatSectionStyles.messageBubbleBase,
    ...(isAssistant ? chatSectionStyles.messageBubbleAssistant : chatSectionStyles.messageBubbleUser),
    opacity: item.final === false ? 0.8 : 1,
  };

  return (
    
    <MotionBox
      style={messageContainerStyle}
      variants={bubbleVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Box style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '8px', 
        flexDirection: isAssistant ? 'row' : 'row-reverse',
        width: 'auto'
      }}>
        {isAssistant ? (
          <Avatar 
            color="blue" 
            radius="xl"
            size="sm"
            style={{
              marginRight: '8px',
              background: 'linear-gradient(135deg, rgba(56, 127, 255, 0.2), rgba(37, 99, 235, 0.1))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <IconRobot size={14} />
          </Avatar>
        ) : (
          <Avatar 
            color="violet" 
            radius="xl"
            size="sm"
            style={{
              marginLeft: '8px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(99, 37, 235, 0.1))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <IconUser size={14} />
          </Avatar>
        )}

        <div style={bubbleStyle}>
          {item.final === false ? (
            <motion.div
              variants={typingIndicator}
              animate="animate"
              style={chatSectionStyles.messageText}
            >
              <Group gap={4}>
                <motion.span>•</motion.span>
                <motion.span>•</motion.span>
                <motion.span>•</motion.span>
              </Group>
            </motion.div>
          ) : (
            <Text style={chatSectionStyles.messageText}>
              {item.text}
            </Text>
          )}
          
          <Text 
            size="xs" 
            style={{ 
              opacity: 0.5, 
              marginTop: 4,
              fontSize: '0.7rem',
              color: 'var(--mantine-color-gray-5)'
            }}
          >
            {formatTimestamp(item.created_at)}
          </Text>
        </div>
      </Box>
    </MotionBox>
  );
};
