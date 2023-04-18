import '../../ids-button/ids-button';
import '../../ids-trigger-field/ids-trigger-field';
import '../../ids-input/ids-input';
import '../../ids-dropdown/ids-dropdown';

import type IdsButton from '../../ids-button/ids-button';

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
