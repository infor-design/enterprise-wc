import '../../ids-splitter/ids-splitter';
import '../../ids-badge/ids-badge';
import '../../ids-tag/ids-tag';
import '../../ids-notification-banner/ids-notification-banner';
import '../../ids-breadcrumb/ids-breadcrumb';
import '../../ids-color-picker/ids-color-picker';
import '../../ids-counts/ids-counts';
import '../../ids-rating/ids-rating';
import '../../ids-image/ids-image';
import '../../ids-progress-bar/ids-progress-bar';
import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import '../../ids-data-grid/ids-data-grid';
import '../../ids-data-label/ids-data-label';
import '../../ids-month-view/ids-month-view';
import '../../ids-pager/ids-pager';
import '../../ids-scrollable/ids-scrollable';
import '../../ids-scrollable/ids-sticky';
import '../../ids-tabs/ids-tabs';
import '../../ids-tabs/ids-tabs-context';
import '../../ids-toggle-button/ids-toggle-button';
import '../../ids-toast/ids-toast';
import '../../ids-slider/ids-slider';
import '../../ids-swappable/ids-swappable';
import '../../ids-swappable/ids-swappable-item';
import '../../ids-list-builder/ids-list-builder';
import '../../ids-step-chart/ids-step-chart';
import '../../ids-week-view/ids-week-view';

// Init Some components that need JS
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';
import booksJSON from '../../../assets/data/books.json';
import bikesJSON from '../../../assets/data/bikes.json';

// Example for populating the DataGrid
const dataGrid = document.querySelector<IdsDataGrid>('#data-grid-1')!;

if (dataGrid) {
  (async function init() {
    // Do an ajax request
    const url: any = booksJSON;
    const columns: IdsDataGridColumn[] = [];

    // Set up columns
    columns.push({
      id: 'selectionCheckbox',
      name: 'selection',
      sortable: false,
      resizable: false,
      formatter: dataGrid.formatters.selectionCheckbox,
      align: 'center'
    });
    columns.push({
      id: 'rowNumber',
      name: '#',
      formatter: dataGrid.formatters.rowNumber,
      sortable: false,
      resizable: true,
      reorderable: true,
      readonly: true,
      width: 65
    });
    columns.push({
      id: 'description',
      name: 'Description',
      field: 'description',
      sortable: true,
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'ledger',
      name: 'Ledger',
      field: 'ledger',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'publishDate',
      name: 'Pub. Date',
      field: 'publishDate',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.date
    });
    columns.push({
      id: 'publishTime',
      name: 'Pub. Time',
      field: 'publishDate',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.time
    });
    columns.push({
      id: 'price',
      name: 'Price',
      field: 'price',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.decimal,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'bookCurrency',
      name: 'Currency',
      field: 'bookCurrency',
      resizable: true,
      reorderable: true,
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'transactionCurrency',
      name: 'Transaction Currency',
      field: 'transactionCurrency',
      formatter: dataGrid.formatters.text,
    });
    columns.push({
      id: 'integer',
      name: 'Price (Int)',
      field: 'price',
      formatter: dataGrid.formatters.integer,
      formatOptions: { locale: 'en-US' } // Data Values are in en-US
    });
    columns.push({
      id: 'location',
      name: 'Location',
      field: 'location',
      formatter: dataGrid.formatters.hyperlink,
      href: '#',
      click: () => { console.info('Link was clicked'); }
    });
    columns.push({
      id: 'postHistory',
      name: 'Post History',
      field: 'postHistory',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'active',
      name: 'Active',
      field: 'active',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'convention',
      name: 'Convention',
      field: 'convention',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'methodSwitch',
      name: 'Method Switch',
      field: 'methodSwitch',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'trackDeprecationHistory',
      name: 'Track Deprecation History',
      field: 'trackDeprecationHistory',
      formatter: dataGrid.formatters.text
    });
    columns.push({
      id: 'useForEmployee',
      name: 'Use For Employee',
      field: 'useForEmployee',
      formatter: dataGrid.formatters.password
    });
    columns.push({
      id: 'deprecationHistory',
      name: 'Deprecation History',
      field: 'deprecationHistory',
      formatter: dataGrid.formatters.text
    });

    dataGrid.columns = columns;
    const setData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      dataGrid.data = data;
    };

    setData();
  }());
}

// Handle Theme Picker Changes
const primaryColor = (document as any).querySelector('#primary-color');
const backgroundColor = (document as any).querySelector('#background-color');
const textColor = (document as any).querySelector('#text-color');
const appendStyleSheet = () => {
  const themeStyles = `:root, :host {
    --ids-color-primary: ${primaryColor.value};
    --ids-body-background-color: ${backgroundColor.value};
    --ids-text-color: ${textColor.value};
  }`;

  const doc = (document.head as any);
  const styleElem = document.querySelector('#ids-theme-builder');
  const style = styleElem || document.createElement('style');
  style.textContent = themeStyles;
  style.id = 'ids-theme-builder';
  style.setAttribute('nonce', primaryColor.nonce);
  if (!styleElem) doc.appendChild(style);
};

// Update Styles
document.querySelectorAll('ids-color-picker').forEach((picker) => {
  picker.addEventListener('change', () => {
    appendStyleSheet();
  });
});

// Switch Values on Theme Change
document.addEventListener('themechanged', () => {
  const style = getComputedStyle(document.body);
  primaryColor.value = style.getPropertyValue('--ids-color-primary');
  backgroundColor.value = style.getPropertyValue('--ids-body-background-color');
  textColor.value = style.getPropertyValue('--ids-text-color');
  document.querySelector('#ids-theme-builder')?.remove();
});

// Implement Toggle Button
document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e: any) => {
      e.target.toggle();
    });
  });
});

// Implement Toast Click
document.addEventListener('DOMContentLoaded', () => {
  const idsContainer = document.querySelector('ids-container');
  const btnToastDemo = document.querySelector('#btn-toast-demo');

  // Show toast message
  btnToastDemo?.addEventListener('click', () => {
    const toastId = 'test-demo-toast';
    let toast: any = document.querySelector(`#${toastId}`);
    if (!toast) {
      toast = document.createElement('ids-toast');
      toast.setAttribute('id', toastId);
      idsContainer?.appendChild(toast);
    }
    toast.show({
      title: 'Application Offline',
      message: 'This is a Toast message.'
    });
  });
});

// =================================================================
// Slider
// =================================================================
const labels = [{
  value: 0,
  text: 'very bad',
  color: 'var(--ids-color-ruby-100)'
}, {
  value: 20,
  text: 'poor',
  color: 'var(--ids-color-ruby-80)'
}, {
  value: 40,
  text: 'average',
  color: 'var(--ids-color-amber-80)'
}, {
  value: 60,
  text: 'good',
  color: 'var(--ids-color-amber-40)'
}, {
  value: 80,
  text: 'very good',
  color: 'var(--ids-color-emerald-60)'
}, {
  value: 100,
  text: 'excellent',
  color: 'var(--ids-color-emerald-90)'
}];

const getClosestLabelSettings = (targetValue: number) => labels.find((el) => targetValue <= el.value);

document.addEventListener('DOMContentLoaded', () => {
  const survey = (document as any).querySelector('.survey');
  if (survey) {
    // Set label text
    survey.labels = labels.map((el) => el.text);

    // Adjust slider track/tick color when value changes
    const fixSliderColorOnChange = (e: CustomEvent) => {
      const sliderValue = e.detail.value;
      const targetLabelSettings = getClosestLabelSettings(sliderValue);
      survey.color = targetLabelSettings?.color;
    };
    survey.color = getClosestLabelSettings(survey.value)?.color;
    survey.onEvent('ids-slider-drag', survey, fixSliderColorOnChange);
    survey.onEvent('change', survey, fixSliderColorOnChange);
  }
});

// =================================================================
// List Builder
// =================================================================
const listBuilderEl: any = document.querySelector('#list-builder-tb');
if (listBuilderEl) {
  const setData = async () => {
    const res = await fetch((bikesJSON as any));
    const data = await res.json();
    listBuilderEl.data = data;
  };
  setData();
}
