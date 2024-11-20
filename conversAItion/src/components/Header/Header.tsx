/* 

This file contains interfaces, components, and styling for the header component, which is used across all pages

*/


import React from 'react';
import { Group, Text, Select, Badge, ActionIcon, Tooltip, Container, rem, useMantineColorScheme } from '@mantine/core';
import { 
  IconVolume, 
  IconBrain, 
  IconSettings, 
  IconHistory,
  IconVocabulary,
  IconChartBar,
  IconBook2
} from '@tabler/icons-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { headerStyles } from './styles';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import conversationLogoDark from '../../assets/conversationlogodarkmode.svg';
import conversationLogoLight from '../../assets/conversationlogolightmode.svg';

interface HeaderProps {
  selectedLanguage: string;
  onLanguageChange: (value: string | null) => void;
  onResetAPIKey: () => void;
  showSettings: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onResetAPIKey,
  showSettings,
}) => {
  const [settingsOpened, setSettingsOpened] = React.useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <>
      <Container size="xl">
        <div style={headerStyles.navbarInner}>
          <Group>
            <img 
              src={colorScheme === 'dark' ? conversationLogoDark : conversationLogoLight} 
              alt="Conversation Logo" 
              style={{ 
                height: '165px',
                width: 'auto',
                marginRight: '12px'
              }} 
            />
            <Select
              size="sm"
              w={120}
              value={selectedLanguage}
              onChange={onLanguageChange}
              data={[ // Adding example languages to the dropdown for testing
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
                { value: 'it', label: 'Italian' },
                { value: 'pt', label: 'Portuguese' },
              ]}
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-dark-6)', // inherited mantine default dark mode bg colour
                  borderColor: 'var(--mantine-color-dark-4)',
                },
              }}
            />
            <Badge // creating the badge component for rating the user's proficiency in the selected language
              variant="dot" 
              color="blue" 
              size="lg"
              style={{
                backgroundColor: 'var(--mantine-color-dark-6)',
                textTransform: 'none',
              }}
            >
              Intermediate {/* Placeholder text for now */}
            </Badge>
          </Group>

          <Group gap="lg"> {/* Creting the header items */}
            <Tooltip label="Pronunciation Practice">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                size="lg"
                style={headerStyles.actionButton}
              >
                <IconVolume style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Vocabulary">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                size="lg"
                style={headerStyles.actionButton}
              >
                <IconVocabulary style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Grammar Lessons">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                size="lg"
                style={headerStyles.actionButton}
              >
                <IconBook2 style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Progress Stats">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                size="lg"
                style={headerStyles.actionButton}
              >
                <IconChartBar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="Learning History">
              <ActionIcon 
                variant="subtle" 
                color="blue" 
                size="lg"
                style={headerStyles.actionButton}
              >
                <IconHistory style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>

            {showSettings && (
              <Tooltip label="Settings">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  size="lg"
                  style={headerStyles.actionButton}
                  onClick={() => setSettingsOpened(true)}
                >
                  <IconSettings style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
              </Tooltip>
            )}
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/" // deprecated but dont know what to replace with
                appearance={{
                  elements: {
                      avatarBox: {
                        width: rem(32),
                        height: rem(32),
                      }
                    }
                  }}
                />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <ActionIcon
                  variant="subtle"
                  color="blue"
                  size="lg"
                  style={headerStyles.actionButton}
                >
                  <IconBrain style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
              </SignInButton>
            </SignedOut>
          </Group>
        </div>
      </Container>

      <SettingsModal // unused settings modal for now
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        onResetAPIKey={onResetAPIKey} // ability for user to set their API key
      />
    </>
  );
};
