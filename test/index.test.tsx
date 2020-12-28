import * as React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';

import { ThemeSwitcherProvider, useThemeSwitcher } from '../src';

// Mock utils
const utils = require('../src/utils');
const mockedCreateLinkElement = jest.fn(utils.createLinkElement);
utils.createLinkElement = mockedCreateLinkElement;

beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation();
});

afterEach(() => {
  jest.clearAllMocks();
  document.documentElement.innerHTML = '';
});

afterAll(() => {
  jest.restoreAllMocks();
});

const themes = {
  dark: './dark.css',
  light: './light.css',
};

const Wrapper = (
  themeOptions: React.ComponentProps<typeof ThemeSwitcherProvider> = {
    themeMap: themes,
  }
) => ({ children }: any) => {
  return (
    <ThemeSwitcherProvider {...themeOptions}>{children}</ThemeSwitcherProvider>
  );
};

describe('Theme switcher', () => {
  it('should add pre-rendered css themes, and be able to switch between them', async () => {
    expect(document.querySelectorAll('link[rel="prefetch"]').length).toBe(0);

    const { result, wait } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper(),
    });

    expect(document.querySelector('body[data-theme]')).toBeFalsy();
    expect(document.querySelectorAll('link[rel="prefetch"]').length).toBe(2);
    expect(result.current).toEqual({
      currentTheme: undefined,
      status: 'idle',
      switcher: expect.any(Function),
      themes: {
        dark: 'dark',
        light: 'light',
      },
    });

    act(() => {
      result.current.switcher({ theme: result.current.themes.dark });
    });

    expect(result.current.status).toBe('loading');

    await wait(
      () =>
        !!document.querySelector(
          'link[href="./dark.css"][id="current-theme-style"]'
        )
    );

    act(() => {
      mockedCreateLinkElement.mock.calls[0][0].onload();
    });

    expect(document.querySelector('body[data-theme="dark"]')).toBeTruthy();
    expect(result.current.status).toBe('loaded');
    expect(result.current).toEqual({
      currentTheme: 'dark',
      status: 'loaded',
      switcher: expect.any(Function),
      themes: {
        dark: 'dark',
        light: 'light',
      },
    });

    act(() => {
      result.current.switcher({ theme: result.current.themes.light });
    });

    expect(result.current.status).toBe('loading');

    await wait(
      () =>
        !!document.querySelector(
          'link[href="./light.css"][id="current-theme-style"]'
        )
    );

    act(() => {
      mockedCreateLinkElement.mock.calls[1][0].onload();
    });

    expect(document.querySelector('body[data-theme="light"]')).toBeTruthy();
    expect(result.current.status).toBe('loaded');
    expect(result.current).toEqual({
      currentTheme: 'light',
      status: 'loaded',
      switcher: expect.any(Function),
      themes: {
        dark: 'dark',
        light: 'light',
      },
    });
  });

  it('should be able to add default theme', async () => {
    const { result, wait } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({ themeMap: themes, defaultTheme: 'dark' }),
    });

    await wait(
      () =>
        !!document.querySelector(
          'link[href="./dark.css"][id="current-theme-style"]'
        )
    );

    act(() => {
      mockedCreateLinkElement.mock.calls[0][0].onload();
    });

    expect(result.current).toEqual({
      currentTheme: 'dark',
      status: 'loaded',
      switcher: expect.any(Function),
      themes: {
        dark: 'dark',
        light: 'light',
      },
    });
  });

  it('should be able to change custom id and custom attribute', async () => {
    const customId = 'custom-id';
    const customAttr = 'custom-attr';

    const { wait } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        id: customId,
        attr: customAttr,
      }),
    });

    await wait(
      () => !!document.querySelector(`link[href="./dark.css"][id=${customId}]`)
    );

    expect(document.querySelector(`body[${customAttr}="dark"]`)).toBeTruthy();
  });

  it('should error if there is no provider', () => {
    const { result } = renderHook(() => useThemeSwitcher());

    expect(result.error).toMatchInlineSnapshot(
      `[Error: To use \`useThemeSwitcher\`, component must be within a ThemeSwitcherProvider]`
    );
  });

  it('should insert styles on comment insertionPoint', () => {
    const insertionPoint = 'insert-style-here';

    document.head.insertBefore(
      document.createComment(insertionPoint),
      document.head.firstElementChild
    );

    const otherElement = document.createElement('meta');
    document.head.append(otherElement);

    renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        insertionPoint,
      }),
    });

    function allPreviousElements(element: Element | null) {
      const previousElements: HTMLLinkElement[] = [];
      while ((element = element!.previousElementSibling))
        previousElements.push(element as HTMLLinkElement);

      return previousElements;
    }

    const element = document.head.lastElementChild;
    const previousElements = allPreviousElements(element);

    previousElements.forEach(elem => {
      const conditions = [
        'current-theme-style',
        'theme-prefetch-dark',
        'theme-prefetch-light',
      ];
      const found = conditions.some(condition => elem.id === condition);
      expect(found).toBeTruthy();
    });
  });

  it('should insert styles on DOM insertionPoint', () => {
    const insertionPoint = document.createElement('noscript');
    insertionPoint.id = 'style-insertion-point';

    document.head.insertBefore(insertionPoint, document.head.firstElementChild);

    const otherElement = document.createElement('meta');
    document.head.append(otherElement);
    renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        insertionPoint: document.getElementById(insertionPoint.id) ?? undefined,
      }),
    });

    function allPreviousElements(element: Element | null) {
      const previousElements: HTMLLinkElement[] = [];
      while ((element = element!.previousElementSibling))
        previousElements.push(element as HTMLLinkElement);

      return previousElements;
    }

    document.getElementById(insertionPoint.id)?.remove();
    const element = document.head.lastElementChild;
    const previousElements = allPreviousElements(element);

    previousElements.forEach(elem => {
      const conditions = [
        'current-theme-style',
        'theme-prefetch-dark',
        'theme-prefetch-light',
      ];
      const found = conditions.some(condition => elem.id === condition);
      expect(found).toBeTruthy();
    });
  });

  it('should warn when comment insertionPoint does not exist', () => {
    renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        insertionPoint: 'not-in-dom-insertion-point',
      }),
    });

    expect(console.warn).toHaveBeenCalledTimes(3);
    // @ts-ignore
    expect(console.warn.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Insertion point 'not-in-dom-insertion-point' does not exist. Be sure to add comment on head and that it matches the insertionPoint"`
    );
  });

  it('should warn when DOM insertionPoint does not exist', () => {
    renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        insertionPoint: document.getElementById('not-in-dom-insertion-point'),
      }),
    });

    expect(console.warn).toHaveBeenCalledTimes(3);
    // @ts-ignore
    expect(console.warn.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Insertion point 'null' does not exist. Be sure to add comment on head and that it matches the insertionPoint"`
    );
  });

  it('should append to head even when insertionPoint does not exist', async () => {
    const { wait } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
        insertionPoint: 'not-in-dom-insertion-point',
      }),
    });

    await wait(
      () =>
        !!document.querySelector(
          'link[href="./dark.css"][id="current-theme-style"]'
        )
    );
    expect(document.querySelectorAll('link[rel="prefetch"]').length).toBe(2);
  });

  it('should display error when theme is not found', () => {
    const { result } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper(),
    });

    act(() => {
      result.current.switcher({ theme: 'this-theme-does-not-exist' });
    });

    expect(console.warn).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(console.warn.mock.calls[0][0]).toMatchInlineSnapshot(
      `"Could not find specified theme"`
    );
  });

  it('should not change theme when selecting the same theme', () => {
    const { result } = renderHook(() => useThemeSwitcher(), {
      wrapper: Wrapper({
        themeMap: themes,
        defaultTheme: 'dark',
      }),
    });

    act(() => {
      mockedCreateLinkElement.mock.calls[0][0].onload();
    });

    const expectedResult = result.current;

    act(() => {
      result.current.switcher({ theme: result.current.themes.dark });
    });

    expect(result.current).toEqual(expectedResult);
  });
});
