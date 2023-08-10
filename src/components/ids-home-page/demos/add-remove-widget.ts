// home page add/remove widget
import '../ids-home-page';

document.addEventListener('DOMContentLoaded', () => {
  const homePage: any = document.querySelector('#home-page-toggle-widget');
  const btnToggle: any = document.querySelector('#btn-home-page-toggle-widget');

  const toggleWidgetId = 'toggle-widget';
  let isAdded = false;

  // Add widget
  const addWidget = () => {
    btnToggle.text = 'Remove Widget';
    const template = document.createElement('template');
    template.innerHTML = `
      <ids-widget slot="widget" id="${toggleWidgetId}">
        <div slot="widget-header">
          <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">Widget 1x1 (Dom Order 4) - D</ids-text>
        </div>
        <div slot="widget-content"></div>
      </ids-widget>`;

    const widget = template.content.cloneNode(true);
    const refEl = document.querySelector('#hp-widget-2');
    homePage.insertBefore(widget, refEl);
  };

  // Remove widget
  const removeWidget = () => {
    const toggleWidget = document.querySelector(`#${toggleWidgetId}`);
    toggleWidget?.remove();
    btnToggle.text = 'Add Widget';
  };

  // Bind toggle button
  btnToggle?.addEventListener('click', () => {
    if (isAdded) removeWidget();
    else addWidget();
    isAdded = !isAdded;
  });
});
