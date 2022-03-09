import IdsButton from '../ids-button';

const times = [];

const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid[cols="4"]');
  for (let j = 0; j < 9; j++) {
    const t0 = performance.now();
    section.innerHTML = '';
    for (let index = 0; index < 1000; index++) {
      let html = '';
      html += `<ids-layout-grid-cell>
      <ids-button id="button-${index}" type="secondary">Button ${index}</ids-button>
      </ids-layout-grid-cell>`;
      section.insertAdjacentHTML('beforeend', html);
    }
    const t1 = performance.now();
    console.info('Loading Time:', t1 - t0);
    times.push(t1 - t0);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  appendTestItems();
  console.info('Average Loading Time:', times.reduce((a, b) => (a + b)) / times.length);
  console.info('Page Memory:', window.performance.memory);
});
