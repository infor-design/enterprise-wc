import IdsText from '../../src/ids-text/ids-text';
import IdsHeader from '../ids-header';

import IdsTabs, {
  IdsTab,
  IdsTabContent,
  IdsTabsContext,
  IdsTabDivider
} from '../../src/ids-tabs';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.getElementById('ids-tabs-basic');

  tabs.addEventListener('change', (e) => {
    console.info(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
