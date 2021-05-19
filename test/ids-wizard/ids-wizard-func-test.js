/**
 * @jest-environment jsdom
 */
import IdsWizard, { IdsWizardStep } from '../../src/ids-wizard';
// eslint-disable-next-line
import ResizeObserver from '../helpers/resize-observer-mock';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getLightDOMLabels = (elem) => [...elem.children]
  .map((lEl) => lEl.textContent.trim());
const getShadowDOMLabels = (elem) => [...elem.shadowRoot.querySelectorAll(`ids-text`)]
  .map((idsText) => idsText.textContent.trim());

const getLabels = (elem) => ({
  lightDOMLabels: getLightDOMLabels(elem),
  shadowDOMLabels: getShadowDOMLabels(elem)
});

describe('IdsWizard Tests', () => {
  let elem;

  const createElemViaTemplate = (innerHTML) => {
    elem?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);
    return elem;
  };

  beforeEach(async () => {
    elem = createElemViaTemplate(
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

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = new IdsWizard();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-wizard').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.outerHTML).toMatchSnapshot();
    elem.stepNumber = 2;
    expect(elem.outerHTML).toMatchSnapshot();
    expect(elem.stepNumber).toEqual(2);
  });

  it('initializes without step number and it is set to -1', () => {
    elem = createElemViaTemplate(
      `<ids-wizard>
        <ids-wizard-step>Step One</ids-wizard-step>
        <ids-wizard-step>Step Two</ids-wizard-step>
        <ids-wizard-step>Step Three</ids-wizard-step>
      </ids-wizard>`
    );
    expect(elem.stepNumber).toEqual(-1);
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('updates the step number', () => {
    elem.stepNumber = '3';
    expect(elem.stepNumber).toEqual(3);
  });

  it('has all steps besides selected become visitable links via parent', () => {
    elem.clickable = true;
    expect(elem.clickable).toEqual('true');

    const expectedClickableCount = elem.children.length - 1;

    const clickableCount = elem.shadowRoot.querySelectorAll('.step[href]').length;

    expect(expectedClickableCount).toEqual(clickableCount);
  });

  it('initializes with a non-clickable step and finds that step does not have a clickable link', () => {
    elem = createElemViaTemplate(
      `<ids-wizard step-number="1">
        <ids-wizard-step>Step One</ids-wizard-step>
        <ids-wizard-step>Step Two</ids-wizard-step>
        <ids-wizard-step clickable="false">Step Three</ids-wizard-step>
      </ids-wizard>`
    );

    /** step 1 and step 3 step should not have href attribs */
    const expectedClickableCount = elem.children.length - 2;
    const clickableCount = elem.shadowRoot.querySelectorAll('.step[href]').length;

    expect(expectedClickableCount).toEqual(clickableCount);
  });

  it('sets a random attribute with no visual differences', () => {
    const prevHTML = elem.innerHTML;
    elem.setAttribute('random-attribute', 'random-value');
    elem.randomAttr2 = true;
    expect(elem.innerHTML).toEqual(prevHTML);
  });

  it('renders labels properly based on wizard step labels', () => {
    const { lightDOMLabels, shadowDOMLabels } = getLabels(elem);
    expect(lightDOMLabels.join('_')).toEqual(shadowDOMLabels.join('_'));
  });

  it('refreshes ShadowDOM properly after changing the step markup', async () => {
    elem.remove(elem.children[1]);

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

    await wait(100).then(() => {
      labels = getLabels(elem);
      expect(labels.lightDOMLabels.join('_'))
        .toEqual(labels.shadowDOMLabels.join('_'));
    });
  });

  it('sets the step number to invalid values and sees '
  + 'associated errors', async () => {
    expect(() => { elem.stepNumber = 'z'; })
      .toThrowErrorMatchingSnapshot();

    expect(() => { elem.stepNumber = 0; })
      .toThrowErrorMatchingSnapshot();

    expect(() => { elem.stepNumber = elem.children.length + 1; })
      .toThrowErrorMatchingSnapshot();
  });

  it('on clickable wizard: clicks non-selected step, and the step number changes', async () => {
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
});
