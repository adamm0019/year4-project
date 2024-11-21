import { AppShell, Container, Title, Paper, Text, Grid, Group, Stack } from '@mantine/core';
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import React from 'react';
import { Header } from '../components/Header/Header';
import { AuthOverlay } from '../components/AuthOverlay/AuthOverlay';
import { IconMessage, IconClock, IconMicrophone } from '@tabler/icons-react';
import { LineChart, BarChart, PieChart } from '@mantine/charts';

export const Statistics: React.FC = () => {
  // Test data for statistics
  const stats = {
    totalConversations: 42,
    averageConversationLength: '5:30',
    totalRecordingTime: '3:45:20'
  };

  // Test data for daily activity chart
  const dailyActivityData = [
    { date: '2024-01-01', conversations: 4 },
    { date: '2024-01-02', conversations: 6 },
    { date: '2024-01-03', conversations: 3 },
    { date: '2024-01-04', conversations: 8 },
    { date: '2024-01-05', conversations: 5 },
    { date: '2024-01-06', conversations: 7 },
    { date: '2024-01-07', conversations: 4 },
  ];

  // Test data for conversation durations
  const durationData = [
    { duration: '0-5 min', count: 15 },
    { duration: '5-10 min', count: 20 },
    { duration: '10-15 min', count: 12 },
    { duration: '15+ min', count: 8 },
  ];

  // Test data for topic distribution
  const topicData = [
    { name: 'Travel', value: 35 },
    { name: 'Food', value: 25 },
    { name: 'Culture', value: 20 },
    { name: 'Business', value: 15 },
    { name: 'Other', value: 5 },
  ];

  // Weekly progress sparkline data
  const weeklyProgress = [
    { date: 'Mon', value: 4 },
    { date: 'Tue', value: 6 },
    { date: 'Wed', value: 8 },
    { date: 'Thu', value: 7 },
    { date: 'Fri', value: 9 },
    { date: 'Sat', value: 5 },
    { date: 'Sun', value: 4 },
  ];

  const resetAPIKey = React.useCallback(() => {
    const apiKey = prompt('OpenAI API Key');
    if (apiKey !== null) {
      localStorage.clear();
      localStorage.setItem('tmp::voice_api_key', apiKey);
      window.location.reload();
    }
  }, []);

  const StatCard = ({ title, value, icon, sparklineData }: { 
    title: string; 
    value: string | number; 
    icon: React.ReactNode;
    sparklineData?: typeof weeklyProgress;
  }) => (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Group>
          {icon}
          <div>
            <Text size="sm" c="dimmed">
              {title}
            </Text>
            <Text size="xl" fw={700}>
              {value}
            </Text>
          </div>
        </Group>
      </Group>
    </Paper>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
      style={{ 
        position: 'relative',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
      }}
    >
      <Header
        selectedLanguage="es"
        onLanguageChange={() => {}}
        onResetAPIKey={resetAPIKey}
        showSettings={false}
      />

      <AppShell.Main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', width: '100%', overflow: 'auto' }}>
        <SignedIn>
          <Container size="lg" py="xl">
            <Stack gap="xl">
              <Title order={2}>Conversation Statistics</Title>
              
              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <StatCard
                    title="Total Conversations"
                    value={stats.totalConversations}
                    icon={<IconMessage size={24} />}
                    sparklineData={weeklyProgress}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <StatCard
                    title="Average Conversation Length"
                    value={stats.averageConversationLength}
                    icon={<IconClock size={24} />}
                  />
                </Grid.Col>
                
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <StatCard
                    title="Total Recording Time"
                    value={stats.totalRecordingTime}
                    icon={<IconMicrophone size={24} />}
                  />
                </Grid.Col>
              </Grid>

              <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Title order={3} mb="md">Daily Activity</Title>
                <LineChart
                  h={300}
                  data={dailyActivityData}
                  dataKey="date"
                  series={[
                    { name: 'conversations', color: 'blue' }
                  ]}
                  curveType="monotone"
                  withLegend
                  withTooltip
                  gridAxis="xy"
                />
              </Paper>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={3} mb="md">Conversation Durations</Title>
                    <BarChart
                      h={300}
                      data={durationData}
                      dataKey="duration"
                      series={[
                        { name: 'count', color: 'blue' }
                      ]}
                      withLegend
                      withTooltip
                      gridAxis="y"
                    />
                  </Paper>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Paper shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={3} mb="md">Topic Distribution</Title>
                    <PieChart
                      h={300}
                      data={topicData.map(topic => ({
                        ...topic,
                        color: 'blue'
                      }))}
                      withLabels
                      withTooltip
                      tooltipDataSource="segment"
                      size={200}
                      valueKey="value"
                      categoryKey="name"
                    />
                  </Paper>
                </Grid.Col>
              </Grid>
            </Stack>
          </Container>
        </SignedIn>
        <SignedOut>
          <AuthOverlay />
        </SignedOut>
      </AppShell.Main>
    </AppShell>
  );
};

export default Statistics;