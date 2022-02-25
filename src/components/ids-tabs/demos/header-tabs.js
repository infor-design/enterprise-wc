import './example.scss';
import './header-tabs-demo.scss';
import IdsText from '../../ids-text/ids-text';
import IdsHeader from '../../ids-header/ids-header';

import IdsTabs from '../ids-tabs';
import IdsTab from '../ids-tab';
import IdsTabContent from '../ids-tab-content';
import IdsTabsContext from '../ids-tabs-context';
import IdsTabDivider from '../ids-tab-divider';

document.addEventListener('DOMContentLoaded', () => {
  const tabElements = [...document.querySelectorAll('ids-tabs')];

  tabElements.forEach((el) => el.addEventListener('change', (e) => {
    console.info(`ids-tabs.on('change') =>`, e.target.value);
  }));
});
