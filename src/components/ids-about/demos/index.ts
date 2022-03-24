// Supporting components
import '../../ids-button/ids-button';
import '../ids-about';

import IdsButton from '../../ids-button/ids-button';
import IdsAbout from '../ids-about';

document.addEventListener('DOMContentLoaded', () => {
  const aboutElem: any = document.querySelector('#about-example');
  const triggerBtn: IdsButton = (document.querySelector('#about-example-trigger') as unknown as IdsButton);
  const about = <IdsAbout>aboutElem;

  if (!triggerBtn || !about) {
    return;
  }

  // Link the About to its trigger button
  about.target = triggerBtn;
  about.trigger = 'click';

  // Disable the trigger button when showing the Modal.
  about.addEventListener('beforeshow', () => {
    triggerBtn.disabled = true;
    return true;
  });

  // After the modal is done hiding, re-enable its trigger button.
  about.addEventListener('hide', () => {
    triggerBtn.disabled = false;
  });
});
