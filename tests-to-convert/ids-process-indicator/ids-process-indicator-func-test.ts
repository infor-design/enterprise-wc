/**
 * @jest-environment jsdom
 */
import '../../src/components/ids-process-indicator/ids-process-indicator';
import '../../src/components/ids-process-indicator/ids-process-indicator-step';

const HTMLSnippets = {
  VANILLA_PROCESS_INDICATOR: (
    `<ids-process-indicator>
  <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
  <ids-process-indicator-step status="started" label="Delivered"></ids-process-indicator-step>
  </ids-process-indicator>`
  ),
  STARTED_PROCESS_INDICATOR: (
    `<ids-process-indicator>
   <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
   <ids-process-indicator-step label="3rd Level - Multiple Approvers" status="started"></ids-process-indicator-step>
   </ids-process-indicator>`),
  CANCELLED_PROCESS_INDICATOR: (
    `<ids-process-indicator>
  <ids-process-indicator-step status="done" label="Prepare"></ids-process-indicator-step>
  <ids-process-indicator-step status="cancelled" label="Advertisement"></ids-process-indicator-step>
  <ids-process-indicator-step status="started" label="Delivered"></ids-process-indicator-step>
  </ids-process-indicator>`
  ),
  EMPTY_ATTRIBUTES_PROCESS_INDICATOR: (
    `<ids-process-indicator>
  <ids-process-indicator-step status="" label=""></ids-process-indicator-step>
  <ids-process-indicator-step status="" label=""></ids-process-indicator-step>
  <ids-process-indicator-step></ids-process-indicator-step>
  </ids-process-indicator>`
  ),
  NO_STEPS_PROCESS_INDICATOR: (
    `<ids-process-indicator>
    </ids-process-indicator>`
  ),
};

describe('IdsProcessIndicator Component', () => {
  let processIndicator: any;

  const createElemViaTemplate = async (innerHTML: any) => {
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

  test('sets labels correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.VANILLA_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-indicator-step');
    steps.forEach((s: any) => {
      expect(s.label).toBeTruthy();
    });
  });

  test('sets cancelled status correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.CANCELLED_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-indicator-step');
    steps.forEach((s: any, i) => {
      expect(s.status).toBeTruthy();
      if (i === 1) {
        expect(s.status).toBe('cancelled');
      }
    });
  });

  test('sets empty attributes correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.EMPTY_ATTRIBUTES_PROCESS_INDICATOR);
    const steps = document.querySelectorAll('ids-process-indicator-step');
    steps.forEach((s: any) => {
      expect(s.status).toBeFalsy();
      expect(s.label).toBe('empty label');
    });
  });

  test('handles icon changes/removal correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.CANCELLED_PROCESS_INDICATOR);
    const step: any = document.querySelector('ids-process-indicator-step[status="cancelled"]');
    expect(step.container.querySelector('ids-icon')).toBeTruthy();
    step.status = 'done';
    expect(step.container.querySelector('ids-icon')).toBe(null);
  });

  test('handles no steps correctly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.NO_STEPS_PROCESS_INDICATOR);
    expect(processIndicator.shadowRoot.innerHTML).toMatchSnapshot();
  });

  test('sets the xl-label corrrectly', async () => {
    processIndicator = await createElemViaTemplate(HTMLSnippets.STARTED_PROCESS_INDICATOR);
    expect(processIndicator.container.querySelector('.xs-header .label').innerHTML).toEqual('None');
  });
});
