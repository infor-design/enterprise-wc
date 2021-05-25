// Use the container to set the language
const container = document.querySelector('ids-container');

// Asyncronously load a language and display the strings
(async function loadMessages() {
  let html = '';
  const initialLocale = 'zh';

  // Set language and wait for it to load
  await container.setLanguage(initialLocale);

  // Show them in the page
  const keys = Object.keys(container.language.messages);
  for (let i = 0; i < keys.length; i++) {
    html += `<ids-layout-grid-cell col-span="1">
      <ids-text font-weight="bold">${keys[i]}</ids-text>
    </ids-layout-grid-cell>
    <ids-layout-grid-cell col-span="3">
      <ids-text translate-text="true" language="${initialLocale}">${keys[i]}</ids-text>
      </ids-layout-grid-cell>`;
  }
  document.querySelector('#translation-container').innerHTML = html;
}());
