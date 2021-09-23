/**
 * @jest-environment jsdom
 */
import IdsProcessIndicator from '../../src/components/ids-process-indicator';
import IdsProcessStep from '../../src/components/ids-process-indicator/ids-process-step';

const HTMLSnippets = {
  VANILLA_PROCESS_INDICATOR: (
  `<ids-process-indicator>
  <ids-process-step status="done" label="Prepare"></step>
  <ids-process-step status="started" label="Delivered"></step>
  </ids-process-indicator>`
  ),
  CANCELLED_PROCESS_INDICATOR: (
  `<ids-process-indicator>
  <ids-process-step status="done" label="Prepare"></step>
  <ids-process-step status="cancelled" label="Advertisement"></step>
  <ids-process-step status="started" label="Delivered"></step>
  </ids-process-indicator>`
  ),
  EMPTY_ATTRIBUTES_PROCESS_INDICATOR: (
  `<ids-process-indicator>
  <ids-process-step status="" label=""></step>
  <ids-process-step status="" label=""></step>
  <ids-process-step status="" label=""></step>
  </ids-process-indicator>`
  ),
};

describe('IdsProcessIndicator Component', () => {
  let processIndicator;

  const createElemViaTemplate = async (innerHTML) => {
    processIndicator?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    processIndicator = template.content.childNodes[0];

    document.body.appendChild(processIndicator);

    return processIndicator;
  };

  afterEach(async () => {
    processIndicator?.remove();
  });

  it('renders with no errors', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-process-indicator').length).toEqual(1);

    processIndicator.remove();

    processIndicator = await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);
    expect(document.querySelectorAll('ids-process-indicator').length).toEqual(1);
    expect(document.querySelectorAll('ids-process-step').length).toEqual(2);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);
    processIndicator.template();
    expect(processIndicator.outerHTML).toMatchSnapshot();
  });

  it('sets labels correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-step');
    steps.forEach((s) => {
      expect(s.label).toBeTruthy();
    });
  });

  it('sets cancelled status correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.CANCELLED_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-step');
    steps.forEach((s, i) => {
      expect(s.status).toBeTruthy();
      if (i === 1) {
        expect(s.status).toBe('cancelled');
      }
    });
  });

  it('sets empty attributes correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.EMPTY_ATTRIBUTES_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-step');
    steps.forEach((s) => {
      expect(s.status).toBeFalsy();
      expect(s.label).toBeFalsy();
    });
  });
});
