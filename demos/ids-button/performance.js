import IdsButton from '../../src/components/ids-button/ids-button';

const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid-cell');
  for (let index = 0; index < 1000; index++) {
    let html = '';
    html += `<ids-button id="button-${index}" type="secondary">
      Button ${index}
    </ids-button>`;
    section.insertAdjacentHTML('beforeend', html);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  appendTestItems();
  console.info(window.performance.now());
});
