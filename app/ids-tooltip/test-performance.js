import IdsButton from '../../src/ids-button/ids-button';

// eslint-disable-next-line no-unused-vars
const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid-cell');
  for (let index = 0; index < 1000; index++) {
    let html = '';
    // Buttons take 802ms (10000)
    // Web Components Buttons takes 14.6s (10000)
    html += `<ids-button id="button-${index}" tooltip="Tooltip ${index}" type="secondary">
    Button ${index}
    </ids-button>`;
    section.insertAdjacentHTML('beforeend', html);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  appendTestItems();
  console.info(window.performance.now());
});
