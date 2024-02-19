/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import wait from '../helpers/wait';
import createFromTemplate from '../helpers/create-from-template';

import IdsWizard from '../../src/components/ids-wizard/ids-wizard';
import IdsWizardStep from '../../src/components/ids-wizard/ids-wizard-step';

const getLightDOMLabels = (elem: any) => [...elem.children]
  .map((lEl) => lEl.textContent.trim());
const getShadowDOMLabels = (elem: any) => [...elem.shadowRoot.querySelectorAll(`ids-text`)]
  .map((idsText) => idsText.textContent.trim());

const getLabels = (elem: any) => ({
  lightDOMLabels: getLightDOMLabels(elem),
  shadowDOMLabels: getShadowDOMLabels(elem)
});

describe('IdsWizard Tests', () => {
  let elem: any;

  beforeEach(async () => {
    elem = createFromTemplate(
      elem,
      `<ids-wizard step-number="1">
        <ids-wizard-step>Step One</ids-wizard-step>
        <ids-wizard-step>Step Two</ids-wizard-step>
        <ids-wizard-step>Step Three</ids-wizard-step>
      </ids-wizard>`
    );
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('render via document.createElement (append laate)', () => {
    const errors = jest.spyOn(global.console, 'error');
    const wizardElem: any = document.createElement('ids-wizard');

    wizardElem.innerHTML = `
      <ids-wizard-step>Step One</ids-wizard-step>
      <ids-wizard-step>Step Two</ids-wizard-step>
      <ids-wizard-step>Step Three</ids-wizard-step>
    `;
    wizardElem.stepNumber = '2';
    document.body.appendChild(wizardElem);

    expect(errors).not.toHaveBeenCalled();
  });

  test('initializes without step number and it is set to -1', () => {
    elem = createFromTemplate(
      elem,
      `<ids-wizard>
        <ids-wizard-step>Step One</ids-wizard-step>
        <ids-wizard-step>Step Two</ids-wizard-step>
        <ids-wizard-step>Step Three</ids-wizard-step>
      </ids-wizard>`
    );
    expect(elem.stepNumber).toEqual(-1);
    expect(elem.outerHTML).toMatchSnapshot();
  });

  test('updates the step number', () => {
    elem.stepNumber = '3';
    expect(elem.stepNumber).toEqual(3);
  });

  test('sets a random attribute with no visual differences', () => {
    const prevHTML = elem.innerHTML;
    elem.setAttribute('random-attribute', 'random-value');
    elem.randomAttr2 = true;
    expect(elem.innerHTML).toEqual(prevHTML);
  });

  test('renders labels properly based on wizard step labels', () => {
    const { lightDOMLabels, shadowDOMLabels } = getLabels(elem);
    expect(lightDOMLabels.join('_')).toEqual(shadowDOMLabels.join('_'));
  });

  test('refreshes ShadowDOM properly after changing the step markup', async () => {
    elem.remove(elem.children[1]);

    await wait(100);
    let labels = getLabels(elem);
    await wait(100).then(() => {
      expect(labels.lightDOMLabels.join('_'))
        .toEqual(labels.shadowDOMLabels.join('_'));
    });

    const addedStep = new IdsWizardStep();
    addedStep.textContent = 'Another Step';

    elem.appendChild(addedStep);

    // MutationObserver must listen/register,
    // so change occurs on next tick
    await wait(100);

    labels = getLabels(elem);
    expect(labels.lightDOMLabels.join('_'))
      .toEqual(labels.shadowDOMLabels.join('_'));
  });

  test('sets the step number to invalid values and sees associated errors', async () => {
    expect(() => { elem.stepNumber = 'z'; })
      .toThrowErrorMatchingSnapshot();

    expect(() => { elem.stepNumber = 0; })
      .toThrowErrorMatchingSnapshot();

    expect(() => { elem.stepNumber = elem.children.length + 1; })
      .toThrowErrorMatchingSnapshot();
  });

  test('on clickable wizard: clicks non-selected step, and the step number changes', async () => {
    const stepNumber = 2;
    elem.clickable = true;

    await wait(100);

    const marker = elem.shadowRoot.querySelector(
      `.step[step-number="${stepNumber}"] .step-marker`
    );

    marker.click();

    await wait(100);

    expect(elem.stepNumber).toEqual(2);
  });

  test('can calculate rect collision', async () => {
    expect(elem.areRectsHColliding({ left: 10, width: 10 }, { left: 10, width: 10 })).toEqual(false);
    expect(elem.areRectsHColliding({ width: 10, right: 10 }, { right: 20 })).toEqual(false);
  });

  test('can set step-width', async () => {
    elem.stepNumber = 2;
    expect(elem.getAttribute('step-number')).toEqual('2');
    elem.stepNumber = 1;
    expect(elem.getAttribute('step-number')).toEqual('1');
  });

  test('cancel resize if 1 step', () => {
    elem = createFromTemplate(
      elem,
      `<ids-wizard step-number="1">
        <ids-wizard-step>Step One</ids-wizard-step>
    </ids-wizard>`
    );

    expect(elem.resizeStepLabelRects(elem)).toEqual([{ left: 0, right: 0, width: 0 }]);
  });
});
