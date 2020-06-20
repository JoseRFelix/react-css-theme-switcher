import * as React from 'react';
import { findCommentNode, arrayToObject } from './utils';

enum Status {
  idle = 'idle',
  loading = 'loading',
  loaded = 'loaded',
}

interface IThemeSwitcherContext {
  currentTheme: string | undefined;
  themes: Record<any, string>;
  switcher: ({ theme }: { theme: string }) => void;
  status: Status;
}

const ThemeSwitcherContext = React.createContext<
  IThemeSwitcherContext | undefined
>(undefined);

interface Props {
  themeMap: Record<any, string>;
  children: React.ReactNode;
  insertionPoint?: string;
  id?: string;
  defaultTheme?: string;
  attr?: string;
}

export function ThemeSwitcherProvider({
  themeMap,
  insertionPoint,
  defaultTheme,
  id = 'theme-style',
  attr = 'data-theme',
  ...rest
}: Props) {
  const [status, setStatus] = React.useState<Status>(Status.idle);
  const [currentTheme, setCurrentTheme] = React.useState<string>();

  const insertStyle = React.useCallback(
    (linkElement: HTMLElement) => {
      if (insertionPoint) {
        const insertionPointElement = findCommentNode(insertionPoint);

        if (!insertionPointElement) {
          console.warn(
            `Insertion point '${insertionPoint}' does not exist. Be sure to add comment on head and that it matches the insertionPoint`
          );
          return document.head.appendChild(linkElement);
        }

        const { parentNode } = insertionPointElement;
        if (parentNode) {
          return parentNode.insertBefore(
            linkElement,
            insertionPointElement.nextSibling
          );
        } else {
          throw new Error('Insertion point is not in the DOM.');
        }
      } else {
        return document.head.appendChild(linkElement);
      }
    },
    [insertionPoint]
  );

  const switcher = React.useCallback(
    ({ theme }: { theme: string }) => {
      if (theme === currentTheme) return;

      const previousStyle = document.getElementById(id);
      if (previousStyle) {
        previousStyle.remove();
      }

      if (themeMap[theme]) {
        setStatus(Status.loading);

        const linkElement = document.createElement('link');
        linkElement.type = 'text/css';
        linkElement.rel = 'stylesheet';
        linkElement.id = id;
        linkElement.href = themeMap[theme];

        linkElement.onload = () => {
          setStatus(Status.loaded);
        };

        insertStyle(linkElement);
        setCurrentTheme(theme);
      } else {
        return console.warn('Could not find specified theme');
      }

      document.body.setAttribute(attr, theme);
    },
    [themeMap, insertStyle, attr, id, currentTheme]
  );

  React.useEffect(() => {
    if (defaultTheme) {
      switcher({ theme: defaultTheme });
    }
  }, [defaultTheme]);

  React.useEffect(() => {
    const themes = Object.keys(themeMap);

    themes.map(theme => {
      const themeAssetId = `theme-prefetch-${theme}`;
      if (!document.getElementById(themeAssetId)) {
        const stylePrefetch = document.createElement('link');
        stylePrefetch.rel = 'prefetch';
        stylePrefetch.type = 'text/css';
        stylePrefetch.id = themeAssetId;
        stylePrefetch.href = themeMap[theme];

        insertStyle(stylePrefetch);
      }
      return '';
    });
  }, [themeMap, insertStyle]);

  const value = React.useMemo(
    () => ({
      switcher,
      status,
      currentTheme,
      themes: arrayToObject(Object.keys(themeMap)),
    }),
    [switcher, status, currentTheme, themeMap]
  );

  return <ThemeSwitcherContext.Provider value={value} {...rest} />;
}

export function useThemeSwitcher() {
  const context = React.useContext(ThemeSwitcherContext);
  if (!context) {
    throw new Error(
      'To use `useThemeSwitcher`, component must be within a ThemeSwitcherProvider'
    );
  }
  return context;
}
