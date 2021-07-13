document.addEventListener('DOMContentLoaded', () => {
  const determinateIndicators = document.querySelectorAll('ids-loading-indicator[progress]');

  let instanceCount = 0;

  for (const el of determinateIndicators) {
    const progressValue = el.getAttribute('progress');
    const template = document.createElement('template');

    const controlsId = `loading-indicator-determinate-controls-${++instanceCount}`;

    template.innerHTML = (
      `<div
        class="loading-indicator-determinate-controls"
        id="${controlsId}"
        >
          <ids-spinbox
            min="0"
            max="100"
            step="${el.parentElement.getAttribute('data-step')}"
            value="${progressValue}"
            label="Progress Value"
            label-hidden
          ></ids-spinbox>
          <ids-tooltip target="#${controlsId}" placement="bottom">Adjust progress value</ids-tooltip>
      </div>`
    );
    const valueControls = template.content.cloneNode(true);
    const valueSpinbox = valueControls.querySelector('ids-spinbox');

    valueSpinbox.addEventListener('change', (e) => {
      el.progress = e.target.value;
    });

    // scan for nearest grid cell parent and then
    // append content to that element

    let gridCellEl = el.parentElement;

    while (gridCellEl.tagName.toLowerCase() !== 'ids-layout-grid-cell') {
      gridCellEl = gridCellEl.parentElement;
    }

    gridCellEl.appendChild(valueControls);
  }
});
