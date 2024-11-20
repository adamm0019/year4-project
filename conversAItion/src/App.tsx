import { MantineProvider } from '@mantine/core';
import { theme } from './styles/theme';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { Home } from './pages/Home';
import { Notifications } from '@mantine/notifications';

function App() {
  return (
    <MantineProvider // initialising the mantineprovider component for styling
      theme={theme}
      defaultColorScheme="dark"
    >
      <Notifications position="top-right"/>
      <Home /> {/*creating an instance of the main page, */}
    </MantineProvider>
  );
}

export default App;
