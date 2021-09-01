import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Switch from 'react-switch';

import { ThemeSwitcherProvider, useThemeSwitcher } from '../.';

const Component = () => {
  const { switcher, themes, currentTheme, status } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  if (status !== 'loaded') {
    return null;
  }

  const toggleDarkMode = checked => {
    switcher({ theme: checked ? themes.dark : themes.light });
    setIsDarkMode(checked);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          margin: 0,
        }}
      >
        Toggle dark mode
      </h1>
      <h2>Current theme: {currentTheme}</h2>

      <Switch
        uncheckedIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
              paddingRight: 2,
            }}
          >
            🌞
          </div>
        }
        checkedIcon={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 20,
              paddingRight: 2,
            }}
          >
            🌑
          </div>
        }
        onColor="#4d4d4d"
        onChange={toggleDarkMode}
        checked={isDarkMode}
      />
    </div>
  );
};

const themes = {
  light: './light.css',
  dark: './dark.css',
};

const App = () => {
  return (
    <ThemeSwitcherProvider
      insertionPoint={document.getElementById('inject-styles-here')}
      themeMap={themes}
      defaultTheme={'dark'}
    >
      <Component />
    </ThemeSwitcherProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
