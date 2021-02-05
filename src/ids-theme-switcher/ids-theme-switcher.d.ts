// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

type IdsThemeVersions = 'light' | 'dark' | 'high-contrast';
type IdsThemeModes = 'classic' | 'new';

interface IdsThemeChangeEventDetail extends Event {
  detail: {
    elem: IdsThemeSwitcher,
    mode: IdsThemeModes,
    version: IdsThemeVersions
  }
}

export class IdsThemeSwitcher extends HTMLElement {
  /** Get/Set the theme/version mode */
  mode: IdsThemeModes;
  /** Get/Set the UI version */
  version: IdsThemeModes;

  /** Fires when a theme is changed (either the mode or the version) */
  on(event: 'themechanged', listener: (detail: IdsThemeChangeEventDetail) => void): this;
}
