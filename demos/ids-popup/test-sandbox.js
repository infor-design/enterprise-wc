import IdsPopup from '../../src/components/ids-popup/ids-popup';
import IdsButton from '../../src/components/ids-button/ids-button';
import IdsInput from '../../src/components/ids-input/ids-input';

import './test-sandbox.scss';

let popupEl;
let xControlEl;
let yControlEl;
let xyControlFieldsetLabelEl;
let xyClickToSetEl;
let alignmentDisplayEl;

/**
 * @param {Event} e the change event object
 */
function targetChangeHandler(e) {
  popupEl.alignTarget = e.target.value;
  if (!e.target.value) {
    xyControlFieldsetLabelEl.textContent = 'Coordinates';
    xyClickToSetEl.disabled = false;
  } else {
    xyControlFieldsetLabelEl.textContent = 'Offsets';
    xyClickToSetEl.disabled = true;
  }
}

/**
 * @param {Event} e the change event object
 */
function containmentChangeHandler(e) {
  let val;
  switch (e.target.value) {
  case 'ids-container':
    val = document.querySelector('ids-container');
    break;
  case 'test-container':
    val = document.querySelector('#test-container');
    break;
  default:
    val = document.body;
    break;
  }
  popupEl.containingElem = val;
}

/**
 * @param {Event} e the change event object
 */
function xAlignChangeHandler(e) {
  const currentVal = popupEl.alignX;
  const newVal = e.target.value;

  if (currentVal !== newVal) {
    popupEl.alignX = newVal;
  } else {
    popupEl.alignEdge = newVal;
  }
}

/**
 * @param {Event} e the change event object
 */
function yAlignChangeHandler(e) {
  const currentVal = popupEl.alignY;
  const newVal = e.target.value;

  if (currentVal !== newVal) {
    popupEl.alignY = newVal;
  } else {
    popupEl.alignEdge = newVal;
  }
}

/**
 * @param {Event} e the change event object
 */
function xPosChangeHandler(e) {
  popupEl.setPosition(e.target.value, null, null, true);
}

/**
 * @param {Event} e the change event object
 */
function yPosChangeHandler(e) {
  popupEl.setPosition(null, e.target.value, null, true);
}

/**
 */
function xyResetHandler() {
  xControlEl.value = 0;
  yControlEl.value = 0;
  popupEl.setPosition(0, 0, null, true);
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

/**
 * @param {Event} e the change event object
 */
function bleedsChangeHandler(e) {
  popupEl.bleed = e.target.checked;
}

// When the Popup page loads, we need to use the CSSOM to append some styles
// that can be modified by changing the attribute (tests the MutationObserver/ResizeObserver)
document.addEventListener('DOMContentLoaded', () => {
  popupEl = document.querySelector('#test-popup');
  xyControlFieldsetLabelEl = document.querySelector('#xy-controls legend');
  xyClickToSetEl = document.querySelector('#xy-click-to-set-option');
  alignmentDisplayEl = document.querySelector('#alignment-display');

  // const centerTargetEl = document.querySelector('#center-point');
  const secondTargetEl = document.querySelector('#second-target');
  const thirdTargetEl = document.querySelector('#third-target');

  // This one is centered on the page, but needs a 100px top margin to shift it around
  // centerTargetEl.style.marginTop = '';

  // This one is aligned 150px from the top and right viewport edges
  secondTargetEl.style.top = '150px';
  secondTargetEl.style.right = '150px';

  // This one is aligned 300px from the top and left viewport edges,
  // as well as allows the size to be controlled (tests some other math)
  thirdTargetEl.style.top = '300px';
  thirdTargetEl.style.left = '300px';
  thirdTargetEl.style.height = '50px';
  thirdTargetEl.style.width = '50px';

  // Setup X/Y coordinates/offsets controls
  xControlEl = document.querySelector('#x-control');
  xControlEl.addEventListener('change', xPosChangeHandler);

  yControlEl = document.querySelector('#y-control');
  yControlEl.addEventListener('change', yPosChangeHandler);

  const xyResetEl = document.querySelector('#xy-controls-reset');
  xyResetEl.addEventListener('click', xyResetHandler);

  // Setup align-target controls
  const alignTargetGroupEl = document.querySelector('#align-targets');
  const targetRadioEls = alignTargetGroupEl.querySelectorAll('input[type="radio"]');
  targetRadioEls.forEach((radioEl) => {
    radioEl.addEventListener('change', targetChangeHandler);
  });

  // Setup containment controls
  const containmentGroupEl = document.querySelector('#containment');
  const containmentRadioEls = containmentGroupEl.querySelectorAll('input[type="radio"]');
  containmentRadioEls.forEach((radioEl) => {
    radioEl.addEventListener('change', containmentChangeHandler);
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

  // Setup toggles
  const animatedControlEl = document.querySelector('#animated-option');
  animatedControlEl.addEventListener('change', animatedChangeHandler);

  const visibleControlEl = document.querySelector('#visible-option');
  visibleControlEl.addEventListener('change', visibleChangeHandler);

  const bleedsControlEl = document.querySelector('#bleeds-option');
  bleedsControlEl.addEventListener('change', bleedsChangeHandler);

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

  // When in coordinates mode, listen for clicks on the document to set the
  // coordinates automatically. If clicking within control boxes, the clicks are ignored.
  document.addEventListener('click', (e) => {
    requestAnimationFrame(() => {
      if (xyClickToSetEl.disabled || !xyClickToSetEl.checked) {
        return;
      }

      const withinFieldset = e.target.closest('fieldset');
      if (withinFieldset) {
        return;
      }

      xControlEl.value = e.clientX;
      yControlEl.value = e.clientY;
      popupEl.setPosition(e.clientX, e.clientY, null, true);
    });
  });
});
