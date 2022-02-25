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
  const tabs = document.querySelector('ids-tabs');

  tabs.addEventListener('change', (e) => {
    console.info(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
