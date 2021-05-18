import IdsTabs, { IdsTab, IdsTabsDivider } from '../../src/ids-tabs';

const overallContainer = document.querySelector('#test-ids-tabs');
const tabContainers = [...overallContainer.children];

for (const c of tabContainers) {
  if (!c.matches(':first-child')) {
    c.style.marginTop = '8px';
  }

  if (c.matches(':nth-child(2)')) {
    c.style.maxWidth = '400px';
  }
}
