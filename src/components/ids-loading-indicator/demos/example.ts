import css from '../../../assets/css/ids-loading-indicator/index.css';

import '../../ids-card/ids-card';
import IdsLoadingIndicator from '../ids-loading-indicator';

const cssLink = `<link href="${css}" rel="stylesheet">`;
document.querySelector('head')?.insertAdjacentHTML('afterbegin', cssLink);

document.addEventListener('DOMContentLoaded', () => {
  const determinateIndicators: any = document.querySelectorAll('ids-spinbox');
  for (const el of determinateIndicators) {
    el.addEventListener('change', (e: Event) => {
      const spinbox = (e.target as any);
      document.querySelector<IdsLoadingIndicator>(`#${spinbox.getAttribute('target-id')}`)!.progress = spinbox.value;
    });
  }
});
