import React from 'react';
import { Group, Text, Select, Badge, ActionIcon, Tooltip, Container, Menu, rem } from '@mantine/core';
import { 
  IconVolume, 
  IconSchool, 
  IconBrain, 
  IconSettings, 
  IconHistory,
  IconVocabulary,
  IconChartBar,
  IconBook2
} from '@tabler/icons-react';
import { headerStyles } from './styles';
import { SettingsModal } from '../SettingsModal/SettingsModal';

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

  return (
    <>
      <Container size="xl">
        <div style={headerStyles.navbarInner}>
          <Group>
            <Text size="lg" fw={700} c="blue.4">Language Learning Assistant</Text>
            <Select
              size="sm"
              w={120}
              value={selectedLanguage}
              onChange={onLanguageChange}
              data={[
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
                { value: 'de', label: 'German' },
                { value: 'it', label: 'Italian' },
                { value: 'pt', label: 'Portuguese' },
              ]}
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-dark-6)',
                  borderColor: 'var(--mantine-color-dark-4)',
                },
              }}
            />
            <Badge 
              variant="dot" 
              color="blue" 
              size="lg"
              style={{
                backgroundColor: 'var(--mantine-color-dark-6)',
                textTransform: 'none',
              }}
            >
              Intermediate
            </Badge>
          </Group>

          <Group gap="lg">
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
          </Group>
        </div>
      </Container>

      <SettingsModal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        onResetAPIKey={onResetAPIKey}
      />
    </>
  );
};
