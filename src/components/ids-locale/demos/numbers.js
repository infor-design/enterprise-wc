// Use the container to set the language
const container = document.querySelector('ids-container');

// Asyncronously load a language and display the strings
(async function loadMessages() {
  const append = (number) => {
    const html = `<ids-layout-grid-cell col-span="3">
    <ids-text>${number}</ids-text>
    </ids-layout-grid-cell>`;
    document.querySelector('#container').insertAdjacentHTML('beforeend', html);
  };

  // Set locale and wait for it to load
  await container.setLocale('de-DE');
  await container.setLocale('en-US');

  // Show some numbers in the page
  append(container.locale.formatNumber(1.0019, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }));

  let num = '123456789012.123456';
  append(container.locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 7,
    maximumFractionDigits: 7
  }));

  num = '123456789012.123456';
  append(container.locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  }));

  num = '123456789012.123456';
  append(container.locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }));

  num = '123456789012345678.123456';
  append(container.locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }));

  container.setLocale('en-US');
  append(container.locale.formatNumber('12,345.123'));
}());
