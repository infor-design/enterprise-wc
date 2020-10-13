import IdsPopup from '../../src/ids-popup/ids-popup';
import IdsInput from '../../src/ids-input/ids-input';
import IdsLabel from '../../src/ids-label/ids-label';
import IdsGridCell from '../../src/ids-layout-grid/ids-grid-cell';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';

import './test-sandbox.scss';

let popupEl;
let xyControlFieldsetLabelEl;
let alignmentDisplayEl;

/**
 * @param {Event} e the change event object
 */
function targetChangeHandler(e) {
  popupEl.alignTarget = e.target.value;
  if (!e.target.value) {
    xyControlFieldsetLabelEl.textContent = 'Coordinates';
  } else {
    xyControlFieldsetLabelEl.textContent = 'Offsets';
  }
}

/**
 * @param {Event} e the change event object
 */
function xAlignChangeHandler(e) {
  popupEl.alignX = e.target.value;
}

/**
 * @param {Event} e the change event object
 */
function yAlignChangeHandler(e) {
  popupEl.alignY = e.target.value;
}

/**
 * @param {Event} e the change event object
 */
function xPosChangeHandler(e) {
  popupEl.x = e.target.value;
}

/**
 * @param {Event} e the change event object
 */
function yPosChangeHandler(e) {
  popupEl.y = e.target.value;
}

/**
 * @param {Event} e the change event object
 */
function animatedChangeHandler(e) {
  popupEl.animated = e.target.checked;
}

/**
 * @param {Event} e the change event object
 */
function visibleChangeHandler(e) {
  popupEl.visible = e.target.checked;
}

// When the Popup page loads, we need to use the CSSOM to append some styles
// that can be modified by changing the attribute (tests the MutationObserver/ResizeObserver)
document.addEventListener('DOMContentLoaded', () => {
  popupEl = document.querySelector('ids-popup');
  xyControlFieldsetLabelEl = document.querySelector('#xy-controls legend');
  alignmentDisplayEl = document.querySelector('#alignment-display');

  const centerTargetEl = document.querySelector('#center-point');
  const secondTargetEl = document.querySelector('#second-target');
  const thirdTargetEl = document.querySelector('#third-target');

  // This one is centered on the page, but needs a 100px top margin to shift it around
  centerTargetEl.style.marginTop = '100px';

  // This one is aligned 150px from the top and right viewport edges
  secondTargetEl.style.top = '150px';
  secondTargetEl.style.right = '150px';

  // This one is aligned 300px from the top and left viewport edges,
  // as well as allows the size to be controlled (tests some other math)
  thirdTargetEl.style.top = '300px';
  thirdTargetEl.style.left = '300px';
  thirdTargetEl.style.height = '50px';
  thirdTargetEl.style.width = '50px';

  // Setup align-target controls
  const alignTargetGroupEl = document.querySelector('#align-targets');
  const targetRadioEls = alignTargetGroupEl.querySelectorAll('input[type="radio"]');
  targetRadioEls.forEach((radioEl) => {
    radioEl.addEventListener('change', targetChangeHandler);
  });

  // Setup x-alignment controls
  const xAlignGroupEl = document.querySelector('#x-alignments');
  const xAlignRadioEls = xAlignGroupEl.querySelectorAll('input[type="radio"]');
  xAlignRadioEls.forEach((radioEl) => {
    radioEl.addEventListener('click', xAlignChangeHandler);
  });

  // Setup y-alignment controls
  const yAlignGroupEl = document.querySelector('#y-alignments');
  const yAlignRadioEls = yAlignGroupEl.querySelectorAll('input[type="radio"]');
  yAlignRadioEls.forEach((radioEl) => {
    radioEl.addEventListener('click', yAlignChangeHandler);
  });

  // Setup X/Y coordinates/offsets controls
  const xControlEl = document.querySelector('#x-control');
  xControlEl.addEventListener('change', xPosChangeHandler);

  const yControlEl = document.querySelector('#y-control');
  yControlEl.addEventListener('change', yPosChangeHandler);

  // Setup toggles
  const animatedControlEl = document.querySelector('#animated-option');
  animatedControlEl.addEventListener('change', animatedChangeHandler);

  const visibleControlEl = document.querySelector('#visible-option');
  visibleControlEl.addEventListener('change', visibleChangeHandler);

  // Have a MutationObserver watch the popup for attribute changes,
  // causing an update to some control displays.
  const testMo = new MutationObserver((mutations) => {
    let changedOnce = false;
    mutations.forEach((mutation) => {
      if (changedOnce || mutation.type !== 'attributes') {
        return;
      }
      alignmentDisplayEl.textContent = `Edge order: "${popupEl.align}"`;
      changedOnce = true;
    });
  });
  testMo.observe(popupEl, {
    attributes: true,
    attributeFilter: ['align'],
    attributeOldValue: true,
    subtree: true
  });
});
