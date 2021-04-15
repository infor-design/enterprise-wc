import IdsButton from '../../src/ids-button/ids-button';

// Saving this text for later
// eslint-disable-next-line no-unused-vars
const appendTestItems = () => {
  const section = document.querySelector('ids-layout-grid-cell');
  for (let index = 0; index < 1000; index++) {
    let html = '';
    // Buttons take 802ms (10000)
    // Web Components Buttons takes 14.6s (10000)
    html += `<ids-button id="button-${index}" type="secondary">
    Button ${index}
    </ids-button>
    <ids-tooltip target="#button-${index}" placement="top">Tooltip ${index}</ids-tooltip>`;
    section.insertAdjacentHTML('beforeend', html);
  }
};
