import './example.scss';
import './header-tabs-demo.scss';
import IdsText from '../../src/components/ids-text/ids-text';
import IdsHeader from '../../src/components/ids-header/ids-header';

import IdsTabs from '../../src/components/ids-tabs/ids-tabs';
import IdsTab from '../../src/components/ids-tabs/ids-tab';
import IdsTabContent from '../../src/components/ids-tabs/ids-tab-content';
import IdsTabsContext from '../../src/components/ids-tabs/ids-tabs-context';
import IdsTabDivider from '../../src/components/ids-tabs/ids-tab-divider';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelector('ids-tabs');

  tabs.addEventListener('change', (e) => {
    console.info(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
