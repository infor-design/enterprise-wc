import '../ids-module-nav';
import '../ids-module-nav-bar';
import '../ids-module-nav-button';
import '../ids-module-nav-content';
import '../ids-module-nav-item';
import '../ids-module-nav-settings';
import '../ids-module-nav-switcher';
import '../ids-module-nav-user';

import IdsIcon from '../../ids-icon/ids-icon';
import appIconJSON from '../../ids-icon/demos/app-icon-data.json';

// Add App Icons from data
document.addEventListener('DOMContentLoaded', async () => {
  const appIconUrl: any = appIconJSON;
  const appIconRes = await fetch(appIconUrl);
  const appIconData = await appIconRes.json();
  IdsIcon.customIconData = appIconData;
});
