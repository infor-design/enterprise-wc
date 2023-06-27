import '../../ids-color-picker/ids-color-picker';
import { adjustColor } from '../../../utils/ids-color-utils/ids-color-utils';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-header/ids-header';
import '../../ids-hyperlink/ids-hyperlink';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-progress-bar/ids-progress-bar';
import '../../ids-search-field/ids-search-field';
import '../../ids-slider/ids-slider';
import '../../ids-tabs/ids-tabs';
import '../../ids-tabs/ids-tabs-context';
import '../../ids-tag/ids-tag';

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

// Implement Toggle Button
window.onload = () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e: any) => {
      e.target.toggle();
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
};
