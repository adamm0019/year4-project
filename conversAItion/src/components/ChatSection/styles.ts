import { CSSProperties } from 'react';
import { keyframes } from '@emotion/react';

export const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

export const slideIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

type StyleObject = {
  [key: string]: CSSProperties;
};

export const chatSectionStyles: StyleObject = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
    backgroundColor: 'var(--mantine-color-dark-7)',
  } as CSSProperties,
  messageContainer: {
    maxWidth: '85%',
    position: 'relative',
    display: 'flex',
    width: 'fit-content',
    alignItems: 'flex-end',
  } as CSSProperties,
  messageBubbleBase: {
    padding: 'var(--mantine-spacing-md) var(--mantine-spacing-xl)',
    borderRadius: '20px',
    position: 'relative',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '280px',
    maxWidth: '100%',
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--mantine-spacing-xs)',
  } as CSSProperties,
  messageBubbleAssistant: {
    background: 'linear-gradient(135deg, rgba(44, 46, 60, 0.9), rgba(34, 36, 50, 0.8))',
    color: 'var(--mantine-color-white)',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
    marginRight: '40px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } as CSSProperties,
  messageBubbleUser: {
    background: 'linear-gradient(135deg, rgba(56, 127, 255, 0.9), rgba(37, 99, 235, 0.8))',
    color: 'var(--mantine-color-white)',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
    marginLeft: '40px',
    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
  } as CSSProperties,
  messageText: {
    margin: 0,
    lineHeight: 1.6,
    letterSpacing: '0.01em',
    fontSize: '0.95rem',
    fontWeight: 400,
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    width: '100%',
    padding: 'var(--mantine-spacing-xs) 0',
  } as CSSProperties,
  messageAudio: {
    marginTop: 'var(--mantine-spacing-xs)',
    borderRadius: 'var(--mantine-radius-md)',
    width: '100%',
    minWidth: '300px',
    height: '40px',
    opacity: 0.9,
    transition: 'opacity 0.2s ease',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 'var(--mantine-spacing-xs)',
  } as CSSProperties,
  connectionControls: {
    borderBottom: '1px solid rgba(55, 58, 64, 0.5)',
    background: 'rgba(37, 38, 43, 0.85)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  } as CSSProperties,
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '32px 0',
    background: 'linear-gradient(180deg, rgba(26,27,30,0) 0%, rgba(26,27,30,0.5) 100%)',
  } as CSSProperties,
  recordingControls: {
    borderTop: '1px solid rgba(55, 58, 64, 0.5)',
    background: 'rgba(37, 38, 43, 0.95)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    bottom: 0,
    boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
  } as CSSProperties,
  canvas: {
    opacity: 0.8,
    transition: 'opacity 0.3s ease',
    filter: 'drop-shadow(0 0 8px rgba(51, 154, 240, 0.2))',
  } as CSSProperties,
  loader: {
    position: 'absolute',
    top: -8,
    right: -8,
    opacity: 0.8,
  } as CSSProperties,
};
