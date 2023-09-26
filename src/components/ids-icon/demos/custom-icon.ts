import IdsIcon from '../ids-icon';

// Add custom icon
import appIconJSON from './app-icon-data.json';
import customIconJSON from './custom-icon-data.json';

(async function initIcons() {
  const customIconUrl: any = customIconJSON;
  const customIconRes = await fetch(customIconUrl);
  const customIconData = await customIconRes.json();

  const appIconUrl: any = appIconJSON;
  const appIconRes = await fetch(appIconUrl);
  const appIconData = await appIconRes.json();

  IdsIcon.customIconData = { ...customIconData, ...appIconData };
}());
