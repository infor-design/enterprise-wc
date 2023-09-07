import IdsGlobal from '../../ids-global/ids-global';

// Asyncronously load a language and display the strings
(async function runExamples() {
  const append = (number: any) => {
    const html = `<ids-layout-grid-cell col-span="3">
    <ids-text>${number}</ids-text>
    </ids-layout-grid-cell>`;
    (document.querySelector('#container') as any).insertAdjacentHTML('beforeend', html);
  };

  // Set locale and wait for it to load
  const locale = IdsGlobal.getLocale();
  await locale.setLocale('de-DE');
  await locale.setLocale('en-US');

  // Show some numbers in the page
  append(locale.formatNumber(1.0019, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }));

  let num = '123456789012.123456';
  append(locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 7,
    maximumFractionDigits: 7
  }));

  num = '123456789012.123456';
  append(locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 6,
    maximumFractionDigits: 6
  }));

  num = '123456789012.123456';
  append(locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }));

  num = '123456789012345678.123456';
  append(locale.formatNumber(num, {
    style: 'decimal',
    minimumFractionDigits: 5,
    maximumFractionDigits: 5
  }));

  locale.setLocale('en-US');
  append(locale.formatNumber('12,345.123'));
}());
