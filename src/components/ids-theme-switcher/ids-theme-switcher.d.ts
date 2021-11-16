// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.
import Base from './ids-theme-switcher-base';

type IdsThemeVersions = 'new' | 'classic';
type IdsThemeModes = 'light' | 'dark' | 'high-contrast';

interface IdsThemeChangeEventDetail extends Event {
  detail: {
    elem: IdsThemeSwitcher,
    mode: IdsThemeModes,
    version: IdsThemeVersions
  }
}

export class IdsThemeSwitcher extends Base {
  /** Get/Set the theme/version mode */
  mode: IdsThemeModes;

  /** Get/Set the UI version */
  version: IdsThemeModes;

  /** Fires when a theme is changed (either the mode or the version) */
  on(event: 'themechanged', listener: (detail: IdsThemeChangeEventDetail) => void): this;
}
