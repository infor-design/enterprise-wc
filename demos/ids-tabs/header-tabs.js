import './example.scss';
import './header-tabs-demo.scss';
import IdsText from '../../src/components/ids-text';
import IdsHeader from '../../src/components/ids-header';

import IdsTabs, {
  IdsTab,
  IdsTabContent,
  IdsTabsContext,
  IdsTabDivider
} from '../../src/components/ids-tabs';

document.addEventListener('DOMContentLoaded', () => {
  const tabElements = [...document.querySelectorAll('ids-tabs')];

  tabElements.forEach((el) => el.addEventListener('change', (e) => {
    console.info(`ids-tabs.on('change') =>`, e.target.value);
  }));
});
