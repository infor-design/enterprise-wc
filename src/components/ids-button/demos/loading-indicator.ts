import '../ids-button';
import type IdsButton from '../ids-button';
import '../../ids-loading-indicator/ids-loading-indicator';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-input/ids-input';

const clickableBtns = document.querySelectorAll<IdsButton>('.btn-click-to-load');
const clickableTriggers: any = document.querySelectorAll<IdsButton>('.btn-trigger-to-load');

clickableBtns.forEach((btn: IdsButton) => {
  btn.addEventListener('click', (e: MouseEvent) => {
    const el = e.target as IdsButton;
    if (el) {
      el.showLoadingIndicator = !el.showLoadingIndicator;
    }
  });
});

clickableTriggers.forEach((btn: IdsButton) => {
  btn.addEventListener('click', (e: MouseEvent) => {
    const el: any = (e.target as IdsButton)?.previousElementSibling;
    if (el) {
      el.showLoadingIndicator = !el.showLoadingIndicator;
    }
  });
});
