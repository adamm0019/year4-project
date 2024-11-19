import { MantineProvider } from '@mantine/core';
import { theme } from './styles/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import {ConsolePage} from './pages/ConsolePage';
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme="dark"
    >
      <Notifications position="top-right"/>
      <ConsolePage />
    </MantineProvider>
  );
}

export default App;
