import IdsIcon from '../ids-icon';

// Add custom icon
import customIconJSON from './custom-icon-data.json';

(async function initIcons() {
  const url: any = customIconJSON;
  const res = await fetch(url);
  const customIconData = await res.json();
  IdsIcon.customIconData = customIconData;
}());
