<div align="center">
  <h1>React CSS Theme Switcher</h1>
</div>

[![npm version](https://img.shields.io/npm/v/react-css-theme-switcher.svg)](https://www.npmjs.com/package/react-css-theme-switcher)
![node](https://img.shields.io/node/v/react-css-theme-switcher.svg)
[![license](https://img.shields.io/npm/l/react-css-theme-switcher.svg)](https://github.com/JoseRFelix/react-css-theme-switcher/blob/master/LICENSE)
[![codecov](https://img.shields.io/codecov/c/github/JoseRFelix/react-css-theme-switcher/master)](https://codecov.io/gh/JoseRFelix/react-css-theme-switcher)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/react-css-theme-switcher)](https://bundlephobia.com/package/react-css-theme-switcher)

> 💫 Switch between CSS themes using React

## Prerequisites

- node >=10

## Installation

```shell
npm i react-css-theme-switcher
```

or with Yarn:

```shell
yarn add react-css-theme-switcher
```

## Usage

Import ThemeSwitcherProvider and pass a theme object with the names of the themes and their respective paths to the CSS stylesheet (normally, public folder).

```jsx
import React from 'react';
import ReactDOM from 'react-dom';

import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

const themes = {
  light: 'public/light.css',
  dark: 'public/dark.css',
};

const App = () => {
  return (
    <ThemeSwitcherProvider defaultTheme="light" themeMap={themes}>
      <Component />
    </ThemeSwitcherProvider>
  );
};
```

Use `useThemeSwitcher` Hook:

```jsx
import { useThemeSwitcher } from 'react-css-theme-switcher';

const Component = () => {
  const { switcher, themes, currentTheme, status } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  if (status === 'loading') {
    return <div>Loading styles...</div>;
  }

  const toggleDarkMode = () => {
    setIsDarkMode(previous => {
      switcher({ theme: previous ? themes.light : themes.dark });
      return !previous;
    });
  };

  return (
    <div>
      <h2>Current theme: {currentTheme}</h2>
      <button onClick={toggleDarkMode} />
    </div>
  );
};
```

### CSS Injection Order

react-css-theme-switcher provides a way to avoid collision with other stylesheets or appended styles by providing where to inject the styles. To achieve this, add an HTML comment like `<!--inject-styles-here-->` somewhere on the head and then provide `'inject-styles-here'` or your custom name in the insertionPoint prop in `ThemeSwitcherProvider`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

      * {
        color: inherit;
      }

      html {
        font-family: 'Poppins', sans-serif;
      }
    </style>
    <!-- inject-styles-here -->
    <title>Playground</title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

```jsx
const App = () => {
  return (
    <ThemeSwitcherProvider
      defaultTheme="light"
      insertionPoint="inject-styles-here"
      themeMap={themes}
    >
      <Component />
    </ThemeSwitcherProvider>
  );
};
```

### HTML Element Insertion Point

Some libraries and frameworks make it hard to use comments in head for handling injection order. To solve this issue, you can provide a DOM element as the insertion point. Take for example a `<noscript></noscript>` element:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

      * {
        color: inherit;
      }

      html {
        font-family: 'Poppins', sans-serif;
      }
    </style>
    <noscript id="inject-styles-here"></noscript>

    <title>Playground</title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```

```jsx
const App = () => {
  return (
    <ThemeSwitcherProvider
      defaultTheme="light"
      insertionPoint={document.getElementById('inject-styles-here')}
      themeMap={themes}
    >
      <Component />
    </ThemeSwitcherProvider>
  );
};
```

## API

### ThemeSwitcherProvider

#### Props

| Name           | Type   | Default value       | Description                                                                                                                                                                                                                         |
|----------------|--------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| attr           | String | data-theme          | Attribute name for that will be appended to the body tag. Its value will be the current theme name.                                                                                                                                 |
| defaultTheme   | String |                     | Default theme to load on mount. Must be in themeMap                                                                                                                                                                                 |
| id             | String | current-theme-style | Id of the current selected CSS.                                                                                                                                                                                                     |
| insertionPoint | String or HTMLElement |                     | Comment string or element where pre-fetch styles and current themes will be injected. The library will look for the comment string inside head element. If missing will append styles at the end of the head. This is useful for CSS override. |
| themeMap       | Object |                     | Object with all themes available. Key is the theme name and the value is the path for the CSS file.                                                                                                                                 |

### useThemeSwitcher

#### Returns

| Name         | Type                                    | Default value | Description                                                                                     |
|--------------|-----------------------------------------|---------------|-------------------------------------------------------------------------------------------------|
| currentTheme | String or Undefined                     | undefined     | Current selected theme                                                                          |
| themes       | Object                                  | themeMap keys | All themes supplied in the themeMap.                                                            |
| switcher     | ({ theme }: { theme: string }) => void; | Function      | Function to change themes.                                                                      |
| status       | enum('idle', 'loading', 'loaded')       | idle          | Current load status of the selected stylesheet. Useful to prevent flicker when changing themes. |

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jfelix.info"><img src="https://avatars1.githubusercontent.com/u/21092519?s=460&u=55be9996a2652c79880c62ad50d06e17639456e8&v=4" width="100px;" alt=""/><br /><sub><b>Jose Felix</b></sub></a><br /><a href="https://github.com/JoseRFelix/react-css-theme-switcher/commits?author=JoseRFelix" title="Code">💻</a> <a href="https://github.com/JoseRFelix/react-css-theme-switcher/commits?author=JoseRFelix" title="Documentation">📖</a> <a href="https://github.com/JoseRFelix/react-css-theme-switcher/commits?author=JoseRFelix" title="Tests">⚠️</a></td>
  </tr>  
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification.
Contributions of any kind are welcome!

## Show your support

Give a ⭐️ if this project helped you!
