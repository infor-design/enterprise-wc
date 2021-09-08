/**
 * @jest-environment jsdom
 */
import IdsSlider from '../../src/components/ids-slider';
import processAnimFrame from '../helpers/process-anim-frame';
import ResizeObserver from '../helpers/resize-observer-mock';

window.ResizeObserver = ResizeObserver;

const HTMLSnippets = {
  SINGLE_SLIDER: (
    `<ids-slider type="single" min="0" max="100"></ids-slider>`
  ),
  DOUBLE_SLIDER: (
    `<ids-container><ids-slider type="double" min="0" max="100"></ids-slider><ids-container>`
  ),
  STEP_SLIDER: (
    `<ids-slider type="step" step-number="5" min="0" max="100"></ids-slider>`
  ),
  VERTICAL_DOUBLE_SLIDER: (
    `<ids-slider type="double" vertical='' min="0" max="100"></ids-slider>`
  ),
  VERTICAL_STEP_SLIDER: (
    `<ids-slider type="step" vertical='' step-number="5" min="0" max="100"></ids-slider>`
  ),
  LANGUAGE_SLIDER: (
    `<ids-container language="en"><ids-slider></ids-slider></ids-container>`
  ),
};

describe('IdsSlider Component', () => {
  let slider;

  const createEvent = (type, attributes = {}) => {
    const event = new Event(type);
    Object.assign(event, attributes);
    return event;
  };

  const createKeyboardEvent = (keyName) => {
    const event = new KeyboardEvent('keydown', { key: keyName });
    return event;
  };

  const createElemViaTemplate = async (innerHTML) => {
    slider?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    slider = template.content.childNodes[0];

    document.body.appendChild(slider);

    await processAnimFrame();

    return slider;
  };

  afterEach(async () => {
    slider?.remove();
  });

  it('renders with no errors', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-slider').length).toEqual(1);

    slider.remove();

    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);
    expect(document.querySelectorAll('ids-slider').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);
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
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);

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
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);
    processAnimFrame();

    expect(slider.stepNumber).toBe(2);

    expect(slider.container.querySelector('ids-text').innerHTML).toBe('0');
  });

  it('sets vertical step labels correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.VERTICAL_STEP_SLIDER);
    processAnimFrame();

    expect(slider.stepNumber).toBe(5);

    slider.labels = ['very bad', 'bad', 'okay', 'good', 'very good'];
    const sliderLabels = slider.container.querySelectorAll('.label');
    expect(sliderLabels.length).toBe(5);

    for (let i = 0; i < slider.labels.length - 1; i++) {
      expect(sliderLabels[slider.labels.length - 1 - i].innerHTML).toBe(slider.labels[i]);
    }
  });

  it('sets step labels correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.STEP_SLIDER);
    processAnimFrame();

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

  it('sets double slider correctly', async () => {
    const idsContainer = await createElemViaTemplate(HTMLSnippets.DOUBLE_SLIDER);
    slider = idsContainer.querySelector('ids-slider');

    processAnimFrame();

    slider.valueSecondary = 80;
    expect(slider.valueSecondary).toBe(80);

    slider.valueSecondary = slider.max + 20;
    expect(slider.valueSecondary).toBe(slider.max);

    slider.thumbDraggable.click();
  });

  it('sets min correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);

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
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);
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
    slider = await createElemViaTemplate(HTMLSnippets.SINGLE_SLIDER);

    slider.type = 'step';
    expect(slider.type).toBe('step');

    slider.type = 'double';
    expect(slider.type).toBe('double');

    slider.type = '';
    expect(slider.type).toBe(slider.DEFAULT_TYPE);

    slider.type = 'asdf';
    expect(slider.type).toBe(slider.DEFAULT_TYPE);

    slider.type = false;
    expect(slider.type).toBe(slider.DEFAULT_TYPE);
  });

  it('sets vertical correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.VERTICAL_DOUBLE_SLIDER);
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
    slider = await createElemViaTemplate(HTMLSnippets.LANGUAGE_SLIDER);
    processAnimFrame();

    document.body.querySelector('ids-container').setAttribute('language', 'ar');

    slider.value = slider.min + 1;

    slider.isRTL = true;
    expect(slider.isRTL).toBeTruthy();

    slider.isRTL = false;
    expect(slider.isRTL).toBeFalsy();

    document.querySelector('ids-container').click();
  });

  it('drags correctly on double slider', async () => {
    const idsContainer = await createElemViaTemplate(HTMLSnippets.DOUBLE_SLIDER);
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
      createEvent('ids-dragstart', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggableSecondary.dispatchEvent(
      createEvent('ids-drag', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggableSecondary.dispatchEvent(
      createEvent('ids-dragend', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('ids-dragstart', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('ids-drag', { detail: { mouseX: 80, mouseY: 12 } })
    );

    slider.thumbDraggable.dispatchEvent(
      createEvent('ids-dragend', { detail: { mouseX: 80, mouseY: 12 } })
    );
  });

  it('clicks correctly on vertical step slider', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.VERTICAL_STEP_SLIDER);
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

    expect(document.activeElement.name).toBe('ids-slider');

    slider.dispatchEvent(
      createKeyboardEvent('ArrowUp')
    );

    slider.dispatchEvent(
      createKeyboardEvent('ArrowLeft')
    );
  });

  it('clicks and drags and navigates keyboard arrows on vertical double slider correctly', async () => {
    slider = await createElemViaTemplate(HTMLSnippets.VERTICAL_DOUBLE_SLIDER);
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

    expect(document.activeElement.name).toBe('ids-slider');

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
});
