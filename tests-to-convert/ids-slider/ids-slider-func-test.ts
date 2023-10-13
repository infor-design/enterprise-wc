/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import createFromTemplate from '../helpers/create-from-template';
import '../helpers/resize-observer-mock';

import '../../src/components/ids-slider/ids-slider';

const HTMLSnippets = {
  SINGLE_SLIDER: (
    `<ids-slider type="single" min="0" max="100" label="Single"></ids-slider>`
  ),
  RANGE_SLIDER: (
    `<ids-container><ids-slider type="range" min="0" max="100" label="Range Minimum" label-secondary="Range Maximum"></ids-slider><ids-container>`
  ),
  STEP_SLIDER: (
    `<ids-slider type="step" step-number="5" min="0" max="100" label="Single Step"></ids-slider>`
  ),
  VERTICAL_RANGE_SLIDER: (
    `<ids-slider type="range" vertical='' min="0" max="100" label="Range Minimum" label-secondary="Range Maximum"></ids-slider>`
  ),
  VERTICAL_STEP_SLIDER: (
    `<ids-slider type="step" vertical='' step-number="5" min="0" max="100" label="Single Step"></ids-slider>`
  ),
  LANGUAGE_SLIDER: (
    `<ids-container language="en"><ids-slider></ids-slider></ids-container>`
  ),
};

describe('IdsSlider Component', () => {
  let slider: any;

  const createEvent = (type: any, attributes = {}) => {
    const event = new Event(type);
    Object.assign(event, attributes);
    return event;
  };

  const createKeyboardEvent = (keyName: any) => {
    const event = new KeyboardEvent('keydown', { key: keyName });
    return event;
  };

  afterEach(async () => {
    slider?.remove();
  });

  it('renders with no errors', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-slider').length).toEqual(1);

    slider.remove();

    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    expect(document.querySelectorAll('ids-slider').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    slider.labels = ['terrible', 'poor', 'average', 'good', 'excellent'];
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    slider.stepNumber = 5;
    slider.type = 'step';
    slider.template();
    expect(slider.outerHTML).toMatchSnapshot();
  });

  it('sets color correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);

    slider.color = '#25af65';
    expect(slider.color).toBe('#25af65');

    slider.color = 'error';
    expect(slider.color).toBe('error');

    slider.color = 'success';
    expect(slider.color).toBe('success');

    slider.color = 'warning';
    expect(slider.color).toBe('warning');

    slider.color = '#606066';
    expect(slider.color).toBe('#606066');

    slider.color = 'amethyst-50';
    expect(slider.color).toBe('amethyst-50');
  });

  it('sets labels correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    processAnimFrame();

    expect(slider.stepNumber).toBe(2);

    expect(slider.container.querySelector('ids-text').innerHTML).toBe('0');
  });

  it('sets vertical step labels correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.VERTICAL_STEP_SLIDER);
    await processAnimFrame();

    expect(slider.stepNumber).toBe(5);

    slider.labels = ['very bad', 'bad', 'okay', 'good', 'very good'];
    const sliderLabels = slider.container.querySelectorAll('.label');
    expect(sliderLabels.length).toBe(5);

    for (let i = 0; i < slider.labels.length - 1; i++) {
      expect(sliderLabels[slider.labels.length - 1 - i].innerHTML).toBe(slider.labels[i]);
    }
  });

  it('sets step labels correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.STEP_SLIDER);
    await processAnimFrame();

    expect(slider.type).toBe('step');
    expect(slider.stepNumber).toBe(5);
    slider.labels = ['very bad', 'bad', 'okay', 'good', 'very good'];
    let sliderLabels = slider.container.querySelectorAll('.label');
    expect(sliderLabels.length).toBe(5);

    for (let i = 0; i < slider.labels.length - 1; i++) {
      expect(sliderLabels[i].innerHTML).toBe(slider.labels[i]);
    }

    slider.stepNumber = 2;
    sliderLabels = slider.container.querySelectorAll('.label');
    expect(sliderLabels.length).toBe(2);
    expect(sliderLabels[0].innerHTML).toBe('0');
    slider.labels = ['worst', 'best'];
    expect(sliderLabels[0].innerHTML).toBe('worst');
    expect(slider.stepNumber).toBe(2);
  });

  it('sets range slider correctly', async () => {
    const idsContainer = await createFromTemplate(slider, HTMLSnippets.RANGE_SLIDER);
    slider = idsContainer.querySelector('ids-slider');
    processAnimFrame();

    slider.valueSecondary = 80;
    expect(slider.valueSecondary).toBe(80);

    slider.valueSecondary = slider.max + 20;
    expect(slider.valueSecondary).toBe(slider.max);

    slider.thumbDraggable.click();
  });

  // @TODO: Re-enable this test (#698) -- works in browser but not in JSDOM */
  it.skip('cannot set range slider thumb values lesser/greater than the opposite thumb', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.RANGE_SLIDER);
    processAnimFrame();

    slider.value = 20;
    slider.valueSecondary = 19;

    expect(slider.value).toBe(20);
    expect(slider.valueSecondary).toBe(20);

    slider.value = 21;

    expect(slider.value).toBe(20);
    expect(slider.valueSecondary).toBe(20);
  });

  it('sets min correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);

    slider.min = '50';
    expect(slider.min).toBe(50);

    slider.min = '';
    expect(slider.min).toBe(slider.DEFAULT_MIN);

    slider.min = undefined;
    expect(slider.min).toBe(slider.DEFAULT_MIN);

    slider.min = slider.max + 1;
    expect(slider.min).toBe(slider.DEFAULT_MIN);
  });

  it('sets max correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    slider.max = '150';
    expect(slider.max).toBe(150);

    slider.max = '';
    expect(slider.max).toBe(slider.DEFAULT_MAX + slider.min);

    slider.max = null;
    expect(slider.max).toBe(slider.DEFAULT_MAX + slider.min);

    slider.max = undefined;
    expect(slider.max).toBe(slider.DEFAULT_MAX + slider.min);

    slider.max = slider.min - 1;
    expect(slider.max).toBe(slider.DEFAULT_MAX + slider.min);
  });

  it('sets type correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);

    slider.type = 'step';
    expect(slider.type).toBe('step');

    slider.type = 'range';
    expect(slider.type).toBe('range');

    slider.type = '';
    expect(slider.type).toBe(slider.DEFAULT_TYPE);

    slider.type = 'asdf';
    expect(slider.type).toBe(slider.DEFAULT_TYPE);

    slider.type = false;
    expect(slider.type).toBe(slider.DEFAULT_TYPE);
  });

  it('sets vertical correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.VERTICAL_RANGE_SLIDER);
    processAnimFrame();

    expect(slider.vertical).toBeTruthy();

    slider.vertical = true;
    expect(slider.vertical).toBeTruthy();

    slider.vertical = false;
    expect(slider.vertical).toBeFalsy();

    slider.value = slider.max + 20;
    expect(slider.value).toBe(slider.max);

    slider.value = slider.min - 20;
    expect(slider.value).toBe(slider.min);

    slider.valueSecondary = slider.min - 20;
    expect(slider.valueSecondary).toBe(slider.min);

    slider.thumbDraggable.focus();
    slider.thumbDraggable.blur();

    slider.thumbDraggableSecondary.focus();
    slider.thumbDraggableSecondary.blur();

    slider.color = 'green';
  });

  it('sets rtl correctly, click outside of slider', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.LANGUAGE_SLIDER);
    processAnimFrame();

    (document.body as any).querySelector('ids-container').setAttribute('language', 'ar');

    slider.value = slider.min + 1;

    slider.isRTL = true;
    expect(slider.isRTL).toBeTruthy();

    slider.isRTL = false;
    expect(slider.isRTL).toBeFalsy();

    (document as any).querySelector('ids-container').click();
  });

  it('drags correctly on range slider', async () => {
    const idsContainer = await createFromTemplate(slider, HTMLSnippets.RANGE_SLIDER);
    slider = idsContainer.querySelector('ids-slider');
    await processAnimFrame();

    const mockBounds = {
      LEFT: 0,
      RIGHT: 100,
      TOP: 0,
      BOTTOM: 24
    };

    slider.trackBounds = mockBounds;

    expect(slider.value).toBe(0);
    expect(slider.valueSecondary).toBe(100);

    idsContainer.click();
    slider.trackArea.click();
    const label = slider.container.querySelector('.label');
    label.click();

    slider.thumbDraggableSecondary.dispatchEvent(
      createEvent('dragstart', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggableSecondary.dispatchEvent(
      createEvent('drag', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggableSecondary.dispatchEvent(
      createEvent('dragend', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('dragstart', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('drag', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('dragend', { detail: { mouseX: 80, mouseY: 12 } })
    );
  });

  it('clicks correctly on vertical step slider', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.VERTICAL_STEP_SLIDER);
    await processAnimFrame();

    const mockBounds = {
      LEFT: 0,
      RIGHT: 24,
      TOP: 0,
      BOTTOM: 100
    };

    slider.trackBounds = mockBounds;

    slider.trackArea.click();
    const label = slider.container.querySelector('.label');
    label.click();

    slider.thumbDraggable.focus();

    expect((document as any).activeElement.name).toBe('ids-slider');

    slider.dispatchEvent(
      createKeyboardEvent('ArrowUp')
    );

    slider.dispatchEvent(
      createKeyboardEvent('ArrowLeft')
    );
  });

  /* TODO: Re-enable this test (#698) */
  it.skip('clicks and drags and navigates keyboard arrows on vertical range slider correctly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.VERTICAL_RANGE_SLIDER);
    processAnimFrame();

    expect(slider.vertical).toBeTruthy();

    slider.trackArea.click();
    const label = slider.container.querySelector('.label');
    label.click();

    const mockBounds = {
      LEFT: 0,
      RIGHT: 24,
      TOP: 0,
      BOTTOM: 200
    };

    slider.trackBounds = mockBounds;

    expect(slider.trackBounds).toBe(mockBounds);

    slider.thumbDraggable.focus();

    expect((document as any).activeElement.name).toBe('ids-slider');

    slider.dispatchEvent(
      createKeyboardEvent('ArrowLeft')
    );

    slider.isRTL = false;

    slider.thumbDraggableSecondary.focus();

    expect(slider.valueSecondary).toBe(100);

    slider.dispatchEvent(
      createKeyboardEvent('ArrowLeft')
    );

    expect(slider.valueSecondary).toBe(99);

    slider.dispatchEvent(
      createKeyboardEvent('ArrowDown')
    );

    expect(slider.valueSecondary).toBe(98);

    slider.dispatchEvent(
      createKeyboardEvent('ArrowRight')
    );

    expect(slider.valueSecondary).toBe(99);

    slider.dispatchEvent(
      createKeyboardEvent('ArrowUp')
    );

    expect(slider.valueSecondary).toBe(100);

    slider.isRTL = true;

    slider.trackArea.click();

    slider.dispatchEvent(
      createKeyboardEvent('ArrowLeft')
    );

    expect(slider.valueSecondary).toBe(100);

    slider.dispatchEvent(
      createKeyboardEvent('ArrowRight')
    );

    slider.dispatchEvent(
      createKeyboardEvent('Enter')
    );
  });

  it('cannot change slider thumb values when disabled', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    processAnimFrame();

    expect(slider.value).toBe(0);

    // Use API to set value
    slider.disabled = true;
    slider.value = 10;

    expect(slider.value).toBe(0);

    // Trigger events that would normally cause the value to change
    slider.dispatchEvent(
      createKeyboardEvent('ArrowRight')
    );

    expect(slider.value).toBe(0);

    // Re-enable the component and set the value
    slider.disabled = false;
    slider.value = 10;

    expect(slider.value).toBe(10);
  });

  it('cannot change slider thumb values when made readonly', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.SINGLE_SLIDER);
    processAnimFrame();

    expect(slider.value).toBe(0);

    // Use API to set value
    slider.readonly = true;
    slider.value = 10;

    expect(slider.value).toBe(0);

    // Trigger events that would normally cause the value to change
    slider.dispatchEvent(
      createKeyboardEvent('ArrowRight')
    );

    expect(slider.value).toBe(0);

    // Re-enable the component and set the value
    slider.readonly = false;
    slider.value = 10;

    expect(slider.value).toBe(10);
  });

  it('has correct aria attributes on slider thumbs', async () => {
    slider = await createFromTemplate(slider, HTMLSnippets.VERTICAL_RANGE_SLIDER);
    await processAnimFrame();

    expect(slider.thumbDraggable.getAttribute('aria-label')).toEqual('Range Minimum');
    expect(slider.thumbDraggableSecondary.getAttribute('aria-label')).toEqual('Range Maximum');

    slider.label = 'Lower Value';
    slider.labelSecondary = 'Upper Value';

    expect(slider.thumbDraggable.getAttribute('aria-label')).toEqual('Lower Value');
    expect(slider.thumbDraggableSecondary.getAttribute('aria-label')).toEqual('Upper Value');
  });
});
