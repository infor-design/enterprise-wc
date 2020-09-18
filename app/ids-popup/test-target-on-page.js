import IdsPopup from '../../src/ids-popup/ids-popup';

import './test-target-on-page.scss';

// When the Popup page loads, we need to use the CSSOM to append some styles
// that can be modified by changing the attribute (tests the MutationObserver/ResizeObserver)
document.addEventListener('DOMContentLoaded', () => {
  const popupAlignTargetEl = document.querySelector('#popup-align-target');
  const otherPopupAlignTargetEl = document.querySelector('#other-popup-align-target');
  const anotherPopupAlignTargetEl = document.querySelector('#another-popup-align-target');

  // This one is centered on the page, but needs a 100px top margin to shift it around
  popupAlignTargetEl.style.marginTop = '100px';

  // This one is aligned 150px from the top and right viewport edges
  otherPopupAlignTargetEl.style.top = '150px';
  otherPopupAlignTargetEl.style.right = '150px';

  // This one is aligned 300px from the top and left viewport edges,
  // as well as allows the size to be controlled (tests some other math)
  anotherPopupAlignTargetEl.style.top = '300px';
  anotherPopupAlignTargetEl.style.left = '300px';
  anotherPopupAlignTargetEl.style.height = '50px';
  anotherPopupAlignTargetEl.style.width = '50px';
});
