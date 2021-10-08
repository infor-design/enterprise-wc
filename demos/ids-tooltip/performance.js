import IdsButton from '../../src/components/ids-button/ids-button';
import IdsTooltip from '../../src/components/ids-tooltip';

const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid[cols="4"]');
  for (let index = 0; index < 1000; index++) {
    let html = '';
    // Buttons take 802ms (10000)
    // Web Components Buttons takes 14.6s (10000)
    html += `<ids-layout-grid-cell>
    <ids-button id="button-${index}" tooltip="Tooltip ${index}" type="secondary">
    Button ${index}
    </ids-button>
   </ids-layout-grid-cell>`;
    section.insertAdjacentHTML('beforeend', html);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  appendTestItems();
  console.info(window.performance.now());
  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', window.performance.memory);
});
