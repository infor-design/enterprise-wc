import '../ids-date-picker';
import '../ids-date-picker-popup';
import '../../ids-button/ids-button';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('ids-button');
  const popup = document.querySelector<any>('ids-date-picker-popup');

  btn?.addEventListener('click', () => {
    popup.visible = !popup.visible;
  });
});
