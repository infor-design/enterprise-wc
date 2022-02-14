import '../ids-button/ids-button.js';

const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid[cols="4"]');
  for (let index = 0; index < 1000; index++) {
    let html = '';
    html += `<ids-layout-grid-cell>
    <ids-button id="button-${index}" type="secondary">Button ${index}</ids-button>
    </ids-layout-grid-cell>`;
    section.insertAdjacentHTML('beforeend', html);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  appendTestItems();
  console.info('Loading Time:', window.performance.now());
  console.info('Page Memory:', window.performance.memory);
});
