/**
 * @jest-environment jsdom
 */
/* eslint-disable no-debugger */
import IdsStepChart from '../../src/ids-step-chart/ids-step-chart';
import IdsText from '../../src/ids-text/ids-text';

describe('Ids Step Chart Tests', () => {
  let elem;

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    return elem;
  };

  beforeEach(async () => {
    elem = await createElemViaTemplate(
      `<ids-step-chart label="2 of 7 steps completed" color="azure08" step-number="7" value="3" completed-label="5 days overdue" steps-in-progress="3" progress-color="ruby03"></ids-step-chart>`
    );
    debugger;
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = new IdsStepChart();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-step-chart').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('generates the correct number of steps', () => {
    debugger;
    expect(elem.shadowRoot.querySelectorAll('.step').length).toEqual(7);
  });

  it('generates the correct number of completed steps', () => {
    expect(elem.shadowRoot.querySelectorAll('.complete').length).toEqual(2);
  });

  it('correctly marks steps as in progress', () => {
    expect(elem.shadowRoot.querySelectorAll('.in-progress').length).toEqual(1);
    expect(elem.shadowRoot.querySelector('.step.in-progress:nth-child(3)')).toBeTruthy();
  });
  it('color is set correctly', () => {
    expect(elem.shadowRoot.querySelector('.in-progress').getAttribute('color')).toBe('ruby03');
    elem.progressColor = 'turquoise06';
    expect(elem.shadowRoot.querySelector('.in-progress').getAttribute('color')).toBe('turquoise06');

    expect(elem.shadowRoot.querySelector('.complete').getAttribute('color')).toBe('azure08');
    elem.color = 'amethyst05';
    expect(elem.shadowRoot.querySelector('.complete').getAttribute('color')).toBe('amethyst05');
  });
  it('can steps in progress be updated', () => {
    elem.stepsInProgress = '3,5,7';
    expect(elem.getAttribute('steps-in-progress')).toBe('3,5,7');
    expect(elem.shadowRoot.querySelectorAll('.in-progress').length).toBe(3);
  });
  it('completed label can be updated', () => {
    debugger;
    expect(elem.shadowRoot.querySelector('.completed-label').innerHTML).toBe('5 days overdue');
    elem.completedLabel = 'Test change';
    expect(elem.getAttribute('completed-label')).toBe('Test change');
    expect(elem.shadowRoot.querySelector('.completed-label').innerHTML).toBe('Test change');
  });
});
