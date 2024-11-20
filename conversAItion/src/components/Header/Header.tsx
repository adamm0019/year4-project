import React from 'react';
import { Group, Text, Select, Badge, ActionIcon, Tooltip, Container, rem, useMantineColorScheme, Menu, Box } from '@mantine/core';
import { 
  IconVolume, 
  IconBrain, 
  IconSettings, 
  IconHistory,
  IconVocabulary,
  IconChartBar,
  IconBook2,
  IconLanguage,
  IconSun,
  IconMoon,
  IconMenu2
} from '@tabler/icons-react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
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

const languages = [
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'it', label: 'Italian', flag: '🇮🇹' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
];

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  onResetAPIKey,
  showSettings,
}) => {
  const [settingsOpened, setSettingsOpened] = React.useState(false);
  const [mobileMenuOpened, setMobileMenuOpened] = React.useState(false);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
  };

  const MobileMenu = () => (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="lg"
          style={headerStyles.actionButton}
        >
          <IconMenu2 style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Practice</Menu.Label>
        <Menu.Item leftSection={<IconVolume size={14} />}>
          Pronunciation
        </Menu.Item>
        <Menu.Item leftSection={<IconVocabulary size={14} />}>
          Vocabulary
        </Menu.Item>
        <Menu.Item leftSection={<IconBook2 size={14} />}>
          Grammar
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Progress</Menu.Label>
        <Menu.Item
          leftSection={<IconChartBar size={14} />}
          component={Link}
          to="/statistics"
        >
          Statistics
        </Menu.Item>
        <Menu.Item leftSection={<IconHistory size={14} />}>
          History
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          leftSection={colorScheme === 'dark' ? <IconSun size={14} /> : <IconMoon size={14} />}
          onClick={toggleColorScheme}
        >
          {colorScheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </Menu.Item>

        {showSettings && (
          <Menu.Item
            leftSection={<IconSettings size={14} />}
            onClick={() => setSettingsOpened(true)}
          >
            Settings
          </Menu.Item>
        )}
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      <div style={headerStyles.header}>
        <Container size="xl">
          <div style={headerStyles.navbarInner}>
            <Group style={headerStyles.languageGroup}>
              <Box hiddenFrom="sm">
                <Link to="/">
                  <img 
                    src={colorScheme === 'dark' ? conversationLogoDark : conversationLogoLight} 
                    alt="Conversation Logo" 
                    style={{...headerStyles.logo, height: rem(120)}}
                  />
                </Link>
              </Box>
              <Box visibleFrom="sm">
                <Link to="/">
                  <img 
                    src={colorScheme === 'dark' ? conversationLogoDark : conversationLogoLight} 
                    alt="Conversation Logo" 
                    style={headerStyles.logo}
                  />
                </Link>
              </Box>
              <Select
                size="md"
                w={{ base: 120, sm: 180 }}
                value={selectedLanguage}
                onChange={onLanguageChange}
                leftSection={<IconLanguage size={16} />}
                data={languages.map(lang => ({
                  value: lang.value,
                  label: `${lang.flag} ${lang.label}`
                }))}
                styles={{
                  root: headerStyles.languageSelect,
                  input: {
                    backgroundColor: 'var(--mantine-color-dark-6)',
                    borderColor: 'var(--mantine-color-dark-4)',
                    height: '42px',
                    fontSize: '1rem',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: 'var(--mantine-color-blue-4)',
                    },
                    '&:focus': {
                      borderColor: 'var(--mantine-color-blue-5)',
                      boxShadow: '0 0 0 2px rgba(51, 154, 240, 0.1)',
                    },
                  },
                  section: {
                    color: 'var(--mantine-color-blue-4)',
                  },
                  dropdown: {
                    border: '1px solid var(--mantine-color-dark-4)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                  option: {
                    transition: 'background-color 0.2s ease',
                    '&[dataSelected]': {
                      backgroundColor: 'var(--mantine-color-blue-7)',
                    },
                    '&[dataHovered]': {
                      backgroundColor: 'var(--mantine-color-dark-5)',
                    },
                  },
                }}
              />
              <Box visibleFrom="sm">
                <Badge
                  variant="dot" 
                  color="blue" 
                  size="lg"
                  style={{
                    ...headerStyles.proficiencyBadge,
                    height: '42px',
                    padding: '0 16px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    border: 'none',
                  }}
                >
                  Intermediate
                </Badge>
              </Box>
            </Group>

            <Group gap="sm">
              <Box visibleFrom="md">
                <Group gap="sm">
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
                    <Link to="/statistics">
                      <ActionIcon 
                        variant="subtle" 
                        color="blue" 
                        size="lg"
                        style={headerStyles.actionButton}
                      >
                        <IconChartBar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                      </ActionIcon>
                    </Link>
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

                  <Tooltip label={colorScheme === 'dark' ? 'Light mode' : 'Dark mode'}>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      size="lg"
                      onClick={toggleColorScheme}
                      style={headerStyles.actionButton}
                    >
                      {colorScheme === 'dark' ? (
                        <IconSun style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                      ) : (
                        <IconMoon style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                      )}
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
              </Box>

              <Box hiddenFrom="md">
                <MobileMenu />
              </Box>

              <SignedIn>
                <UserButton 
                  afterSignOutUrl={window.location.origin}
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
      </div>

      <SettingsModal
        opened={settingsOpened}
        onClose={() => setSettingsOpened(false)}
        onResetAPIKey={onResetAPIKey}
      />
    </>
  );
};
