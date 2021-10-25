import pathData from 'ids-identity/dist/theme-new/icons/empty/path-data.json';
import './example.scss';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.icon-examples');
  const emptyIcons = Object.entries(pathData);
  let exampleIconHtml = '';

  for (let i = 0; i < emptyIcons.length; i++) {
    exampleIconHtml += `<ids-layout-grid-cell>
    <ids-card class="test-card">
      <div slot="card-header">
        <ids-text font-size="20" type="h2" overflow="ellipsis" tooltip="true">${emptyIcons[i][0]}</ids-text>
      </div>
      <div class="card-content" slot="card-content">
        <ids-empty-message icon="${emptyIcons[i][0]}">
          <ids-text type="h2" font-size="20" label="true" slot="label">Alert Label</ids-text>
          <ids-text label="true" slot="description">Description of empty message that explains why and possible contain a hyperlink.</ids-text>
          <ids-button class="action-button" slot="button" type="primary">Action</ids-button>
        </ids-empty-message>
      </div>

    </ids-card>
  </ids-layout-grid-cell>`;
  }

  container.innerHTML = exampleIconHtml;

  const buttons = document.querySelectorAll('.action-button');

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', () => {
      const toastId = 'demo-toast';
      let toast = document.querySelector(`#${toastId}`);
      if (!toast) {
        toast = document.createElement('ids-toast');
        toast.setAttribute('id', toastId);
        document.body.appendChild(toast);
      }

      toast.show({
        title: 'Application Offline',
        message: 'This is a Toast message.'
      });
    });
  }

  const testBtn = document.querySelector('.test-button');
  testBtn.addEventListener('click', () => {
    const test = document.querySelector('#test');
    test.setAttribute('icon', 'empty-no-events');
  });
});
