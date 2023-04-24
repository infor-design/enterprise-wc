import '../../ids-color-picker/ids-color-picker';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-header/ids-header';
import '../../ids-list-view/ids-list-view';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-progress-bar/ids-progress-bar';
import '../../ids-search-field/ids-search-field';
import '../../ids-slider/ids-slider';
import '../../ids-tabs/ids-tabs';
import '../../ids-tabs/ids-tabs-context';
import '../../ids-tag/ids-tag';

// Assets
import eventsJSON from '../../../assets/data/events.json';
import cssListView from '../../../assets/css/ids-list-view/index.css';

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
// List View
// =================================================================
const cssListViewLink = `<link href="${cssListView}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssListViewLink);

const listViewEl: any = document.querySelector('#list-view-tb');
if (listViewEl) {
  const setData = async () => {
    const res = await fetch((eventsJSON as any));
    const data = await res.json();
    listViewEl.data = data;
  };
  setData();
}
