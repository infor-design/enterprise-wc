import '../../ids-splitter/ids-splitter';
import '../../ids-badge/ids-badge';
import '../../ids-tag/ids-tag';
import '../../ids-notification-banner/ids-notification-banner';
import '../../ids-breadcrumb/ids-breadcrumb';
import '../../ids-color-picker/ids-color-picker';
import '../../ids-counts/ids-counts';
import '../../ids-rating/ids-rating';
import '../../ids-image/ids-image';

// Append Style Sheet When Changed
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
