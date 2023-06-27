import '../../ids-action-panel/ids-action-panel';
import '../../ids-accordion/ids-accordion';
import '../../ids-area-chart/ids-area-chart';
import '../../ids-badge/ids-badge';
import '../../ids-bar-chart/ids-bar-chart';
import '../../ids-block-grid/ids-block-grid';
import '../../ids-breadcrumb/ids-breadcrumb';
import '../../ids-calendar/ids-calendar';
import { adjustColor } from '../../../utils/ids-color-utils/ids-color-utils';
import '../../ids-color-picker/ids-color-picker';
import '../../ids-counts/ids-counts';
import '../../ids-data-grid/ids-data-grid';
import '../../ids-data-label/ids-data-label';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-editor/ids-editor';
import '../../ids-empty-message/ids-empty-message';
import '../../ids-expandable-area/ids-expandable-area';
import '../../ids-fieldset/ids-fieldset';
import '../../ids-header/ids-header';
import '../../ids-hierarchy/ids-hierarchy';
import '../../ids-hierarchy/ids-hierarchy-item';
import '../../ids-hierarchy/ids-hierarchy-legend';
import '../../ids-hierarchy/ids-hierarchy-legend-item';
import '../../ids-image/ids-image';
import '../../ids-line-chart/ids-line-chart';
import '../../ids-list-builder/ids-list-builder';
import '../../ids-list-view/ids-list-view';
import '../../ids-loading-indicator/ids-loading-indicator';
import '../../ids-masthead/ids-masthead';
import '../../ids-menu/ids-menu';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-modal/ids-modal';
import '../../ids-month-view/ids-month-view';
import '../../ids-notification-banner/ids-notification-banner';
import '../../ids-pager/ids-pager';
import '../../ids-pie-chart/ids-pie-chart';
import '../../ids-popup/ids-popup';
import '../../ids-progress-bar/ids-progress-bar';
import '../../ids-progress-chart/ids-progress-chart';
import '../../ids-process-indicator/ids-process-indicator';
import '../../ids-rating/ids-rating';
import '../../ids-search-field/ids-search-field';
import '../../ids-skip-link/ids-skip-link';
import '../../ids-slider/ids-slider';
import '../../ids-spinbox/ids-spinbox';
import '../../ids-splitter/ids-splitter';
import '../../ids-step-chart/ids-step-chart';
import '../../ids-swaplist/ids-swaplist';
import '../../ids-swappable/ids-swappable';
import '../../ids-swappable/ids-swappable-item';
import '../../ids-swipe-action/ids-swipe-action';
import '../../ids-tabs/ids-tabs';
import '../../ids-tabs/ids-tabs-context';
import '../../ids-tag/ids-tag';
import '../../ids-textarea/ids-textarea';
import '../../ids-time-picker/ids-time-picker';
import '../../ids-toast/ids-toast';
import '../../ids-toggle-button/ids-toggle-button';
import '../../ids-tooltip/ids-tooltip';
import '../../ids-tree/ids-tree';
import '../../ids-treemap/ids-treemap';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-upload/ids-upload';
import '../../ids-upload-advanced/ids-upload-advanced';
import '../../ids-week-view/ids-week-view';

// Assets
import bikesJSON from '../../../assets/data/bikes.json';
import booksJSON from '../../../assets/data/books.json';
import componentsJSON from '../../../assets/data/components.json';
import cssPopup from '../../../assets/css/ids-popup/index.css';
import cssListView from '../../../assets/css/ids-list-view/index.css';
import eventsJSON from '../../../assets/data/events.json';
import eventTypesJSON from '../../../assets/data/event-types.json';
import headshot from '../../../assets/images/headshot-1.jpg';
import periodsJSON from '../../../assets/data/periods.json';
import placeHolderImg200x200 from '../../../assets/images/placeholder-200x200.png';
import treeBasicJSON from '../../../assets/data/tree-basic.json';

// Types
import type IdsDataGrid from '../../ids-data-grid/ids-data-grid';
import type { IdsDataGridColumn } from '../../ids-data-grid/ids-data-grid-column';

// Implement Action Panel
const actionPanelTriggerBtn: any = document.querySelector('#cap-trigger-btn');
const cap: any = document.querySelector('ids-action-panel');

cap.target = actionPanelTriggerBtn;
cap.triggerType = 'click';
cap.onButtonClick = () => {
  cap.hide();
};

// Datagrid
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
  const primary10 = adjustColor(primaryColor.value, 0.1);
  const primary20 = adjustColor(primaryColor.value, 0.3);
  const primary40 = adjustColor(primaryColor.value, 0.45);
  const primary30 = adjustColor(primaryColor.value, 0.55);
  const primary50 = adjustColor(primaryColor.value, 0.70);
  const primary60 = primaryColor.value;
  const primary70 = adjustColor(primaryColor.value, -0.20);
  const primary80 = adjustColor(primaryColor.value, -0.30);
  const primary90 = adjustColor(primaryColor.value, -0.40);
  const primary100 = adjustColor(primaryColor.value, -0.55);

  const themeStyles = `:root, :host {
    --ids-color-primary: ${primaryColor.value};
    --ids-color-primary-10: ${primary10};
    --ids-color-primary-20: ${primary20};
    --ids-color-primary-30: ${primary30};
    --ids-color-primary-40: ${primary40};
    --ids-color-primary-50: ${primary50};
    --ids-color-primary-60: ${primaryColor.value};
    --ids-color-primary-70: ${primary70};
    --ids-color-primary-80: ${primary80};
    --ids-color-primary-90: ${primary90};
    --ids-color-primary-100: ${primary100};
    --ids-color-background-default: ${backgroundColor.value};
    --ids-color-text: ${textColor.value};
  }`;

  const doc = (document.head as any);
  const styleElem = document.querySelector('#ids-theme-builder');
  const style = styleElem || document.createElement('style');
  style.textContent = themeStyles;
  style.id = 'ids-theme-builder';
  style.setAttribute('nonce', primaryColor.nonce);
  if (!styleElem) doc.appendChild(style);

  document.querySelector('#color-10')?.setAttribute('hex', primary10);
  document.querySelector('#color-20')?.setAttribute('hex', primary20);
  document.querySelector('#color-30')?.setAttribute('hex', primary30);
  document.querySelector('#color-40')?.setAttribute('hex', primary40);
  document.querySelector('#color-50')?.setAttribute('hex', primary50);
  document.querySelector('#color-60')?.setAttribute('hex', primary60);
  document.querySelector('#color-70')?.setAttribute('hex', primary70);
  document.querySelector('#color-80')?.setAttribute('hex', primary80);
  document.querySelector('#color-90')?.setAttribute('hex', primary90);
  document.querySelector('#color-100')?.setAttribute('hex', primary100);
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
  backgroundColor.value = style.getPropertyValue('--ids-color-background-default');
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

// Implement Modal
const triggerId = '#modal-trigger-btn';
const triggerBtn: any = document.querySelector(triggerId);
const modal: any = document.querySelector('ids-modal');

modal.target = triggerBtn;
modal.triggerType = 'click';
modal.onButtonClick = () => {
  modal.hide();
};

// Implement Message
const messageTriggerBtn: any = document.querySelector('#message-example-error-trigger');
const message: any = document.querySelector('#message-example-error');

message.target = messageTriggerBtn;
message.triggerType = 'click';
messageTriggerBtn.onButtonClick = (buttonEl: any) => {
  const response = buttonEl.cancel ? 'cancelled' : 'confirmed';
  console.info(`IdsMessage was ${response}`);
  message.hide();
};

// Implement Popup
const popupTriggerBtn = document.querySelector('#popup-trigger-btn');
const popup: any = document.querySelector('#popup-1');
popup.arrow = 'right';

// Toggle the Popup
popupTriggerBtn?.addEventListener('click', () => {
  popup.visible = !popup.visible;
});

const cssPopupLink = `<link href="${cssPopup}" rel="stylesheet">`;
const head = document.querySelector('head');
if (head) {
  head.insertAdjacentHTML('afterbegin', cssPopupLink);
}

// =================================================================
// Calendar
// =================================================================
const eventsURL: any = eventsJSON;
const eventTypesURL: any = eventTypesJSON;

/**
 * Fetch events.json
 * @returns {Promise} events.json content
 */
function getCalendarEvents(): Promise<any> {
  return fetch(eventsURL).then((res) => res.json());
}

/**
 * Fetch event-types.json
 * @returns {Promise} event-types.json content
 */
function getEventTypes(): Promise<any> {
  return fetch(eventTypesURL).then((res) => res.json());
}

document.addEventListener('DOMContentLoaded', async () => {
  const calendar: any = document.querySelector('ids-calendar');

  // Set event types
  calendar.eventTypesData = await getEventTypes();
  calendar.eventsData = await getCalendarEvents();
});

// =================================================================
// Date Picker
// =================================================================
document.addEventListener('DOMContentLoaded', async () => {
  const datePickerLegend: any = document.querySelector('#e2e-datepicker-legend');

  if (datePickerLegend) {
    datePickerLegend.legend = [
      {
        name: 'Public Holiday',
        color: 'emerald-60',
        dates: ['12/31/2021', '12/24/2021', '1/1/2022'],
      },
      { name: 'Weekends', color: 'amber-60', dayOfWeek: [0, 6] },
      {
        name: 'Other',
        color: 'ruby-30',
        dates: ['1/8/2022', '1/9/2022', '1/23/2022'],
      },
      {
        name: 'Half Days',
        color: 'amethyst-60',
        dates: ['1/21/2022', '1/22/2022'],
      },
      { name: 'Full Days', color: 'azure-30', dates: ['1/24/2022', '1/25/2022'] },
    ];
  }
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
// Treemap
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  const treeDemo: any = document.querySelector('#tree-demo');

  if (treeDemo) {
    (async function init() {
      // Do an ajax request
      const res = await fetch(treeBasicJSON as any);
      const data: any = await res.json();
      treeDemo.data = data;

      // On selected
      treeDemo.addEventListener('selected', (e: any) => {
        console.info('selected:', e?.detail);
      });
    }());
  }
});

// =================================================================
// Treemap
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  const treeMapEl = document.querySelector<any>('ids-treemap');

  if (!treeMapEl) return;

  treeMapEl.data = treeMapEl.treeMap({
    data: [
      {
        value: 28,
        color: '#003876',
        text: 'JSON',
        label: '28%'
      },
      {
        value: 18,
        color: '#004A99',
        text: 'PDF',
        label: '18%'
      },
      {
        value: 8,
        color: '#0054B1',
        text: 'BOD',
        label: '8%'
      },
      {
        value: 8,
        color: '#0066D4',
        text: 'TXT',
        label: '8%'
      },
      {
        value: 17,
        color: '#0072ED',
        text: 'CSV',
        label: '17%'
      },
      {
        value: 7,
        color: '#1C86EF',
        text: 'Assets',
        label: '7%'
      },
      {
        value: 14,
        color: '#55A3F3',
        text: 'Others',
        label: '14%'
      },
    ],
    height: 300
  });
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

// =================================================================
// List View
// =================================================================
const cssListViewLink = `<link href="${cssListView}" rel="stylesheet">`;
head?.insertAdjacentHTML('afterbegin', cssListViewLink);

const listViewEl: any = document.querySelector('#list-view-tb');
if (listViewEl) {
  const setData = async () => {
    const res = await fetch((eventsJSON as any));
    const data = await res.json();
    listViewEl.data = data;
  };
  setData();
}

// =================================================================
// Block Grid
// =================================================================
document.querySelectorAll('ids-block-grid img').forEach((img: any) => {
  img.src = placeHolderImg200x200;
});

// =================================================================
// Hierarchy
// =================================================================
const headshotImg: any = window.document.getElementById('headshot');
headshotImg.src = headshot;

// =================================================================
// Area Chart
// =================================================================
const areaChartEl: any = document.querySelector('#area-chart-tb');
if (areaChartEl) {
  const setData = async () => {
    const res = await fetch((componentsJSON as any));
    const data = await res.json();
    areaChartEl.data = data;
  };
  setData();
}

// =================================================================
// Bar Chart
// =================================================================
const barChartEl: any = document.querySelector('#bar-chart-grouped-tb');
if (barChartEl) {
  const setData = async () => {
    const res = await fetch((componentsJSON as any));
    const data = await res.json();
    barChartEl.data = data;
  };
  setData();
}

// =================================================================
// Pie Chart
// =================================================================
const pieChartEl: any = document.querySelector('#pie-chart-tb');
if (pieChartEl) {
  const setData = async () => {
    const res = await fetch((componentsJSON as any));
    const data = await res.json();
    pieChartEl.data = data;
  };
  setData();
}

// =================================================================
// Donut Chart
// =================================================================
const donutChartEl: any = document.querySelector('#donut-chart-tb');
if (donutChartEl) {
  const setData = async () => {
    const res = await fetch((componentsJSON as any));
    const data = await res.json();
    donutChartEl.data = data;
  };
  setData();
}

// =================================================================
// Line Chart
// =================================================================
const lineChartEl: any = document.querySelector('#line-chart-tb');
if (lineChartEl) {
  const setData = async () => {
    const res = await fetch((componentsJSON as any));
    const data = await res.json();
    lineChartEl.data = data;
  };
  setData();
}

// =================================================================
// Loading Indicator
// =================================================================
document.querySelectorAll('.loading-indicator-tb[progress]').forEach((el: any) => {
  const spinbox = el.nextElementSibling;
  spinbox?.addEventListener('change', (e:Event) => {
    el.progress = (e.target as any).value;
  });
});

// =================================================================
// Swaplist
// =================================================================
const swaplistEl: any = document.querySelector('#swaplist-tb');
if (swaplistEl) {
  const setData = async () => {
    const res = await fetch((periodsJSON as any));
    const data = await res.json();
    swaplistEl.data = data;
  };
  setData();
}
