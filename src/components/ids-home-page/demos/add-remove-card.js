// home page add/remove card
import IdsHomePage from '../ids-home-page';

document.addEventListener('DOMContentLoaded', () => {
  const homePage = document.querySelector('#home-page-toggle-card');
  const btnToggle = document.querySelector('#btn-home-page-toggle-card');

  const toggleCardId = 'toggle-card';
  let isAdded = false;

  // Add card
  const addCard = () => {
    btnToggle.text = 'Remove Card';
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-card slot="card" id="${toggleCardId}">
        <div slot="card-header">
          <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Card 1x1 (Dom Order 4) - D</ids-text>
        </div>
        <div slot="card-content"></div>
      </ids-card>`;

    const card = template.content.cloneNode(true);
    const refEl = document.querySelector('#hp-card-2');
    homePage.insertBefore(card, refEl);
  };

  // Remove card
  const removeCard = () => {
    const toggleCard = document.querySelector(`#${toggleCardId}`);
    toggleCard?.remove();
    btnToggle.text = 'Add Card';
  };

  // Bind toggle button
  btnToggle?.addEventListener('click', () => {
    isAdded ? removeCard() : addCard();
    isAdded = !isAdded;
  });
});
