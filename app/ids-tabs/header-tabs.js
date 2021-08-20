import IdsText from '../../src/ids-text/ids-text';
import IdsTabs, {
  IdsTab,
  IdsTabContent,
  IdsTabContext,
  IdsTabDivider
} from '../../src/ids-tabs';
import IdsHeader from '../ids-header';

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.getElementById('ids-tabs-basic');

  tabs.addEventListener('change', (e) => {
    /* eslint-disable-next-line */
    console.log(`#${e.target.getAttribute('id')}.on('change') =>`, e.target.value);
  });
});
