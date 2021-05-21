/**
 * @jest-environment jsdom
 */
import IdsSpinbox from '../../src/ids-spinbox';

const processAnimFrame = () => new Promise((resolve) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(resolve);
  });
});

const DEFAULT_SPINBOX_HTML = (
  `<ids-spinbox
    value="0"
    min="-25"
    max="25"
    step="5"
    label="Jumps 5 from -25 to 25"
    placeholder="-25=>25"
  ></ids-spinbox>`
);

describe('IdsSpinbox Component', () => {
  let elem;

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    await processAnimFrame();

    return elem;
  };

  it('renders from HTML Template with no errors', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('removes max value and then can set value with no ceiling', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.max = '';
    elem.value = 10000;
    expect(parseInt(elem.value)).toEqual(10000);
  });

  it('sets the label placeholder with no errors', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.placeholder = 'This is helpful';
    expect(elem.placeholder).toEqual('This is helpful');

    elem.label = 'Heading 1';
    expect(elem.label).toEqual('Heading 1');
  });

  it('removes min value and then can set value with no floor', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.min = '';
    elem.value = -10000;
    expect(parseInt(elem.value)).toEqual(-10000);
  });

  it('updates min value but can only set a value to min floor', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.min = -10000;
    elem.value = -100000;
    expect(parseInt(elem.value)).toEqual(-10000);
  });

  it('updates max value but can only set a value to max ceiling', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.max = 10000;
    elem.value = 100000;
    expect(parseInt(elem.value)).toEqual(10000);
  });

  it('renders from HTML Template with no errors', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('presses the increment and decrement buttons with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);

    const [
      decrementButton,
      incrementButton
    ] = [...elem.shadowRoot.querySelectorAll('ids-button')];

    const initialValue = parseInt(elem.value);
    const step = parseInt(elem.step);

    incrementButton.click();
    await processAnimFrame();

    expect(parseInt(elem.value)).toEqual(initialValue + step);

    decrementButton.click();
    await processAnimFrame();

    expect(parseInt(elem.value)).toEqual(initialValue);
    expect(errors).not.toHaveBeenCalled();
  });

  it('increments the value until max, and then cannot increment anymore', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const [
      /* eslint-disable no-unused-vars */
      decrementButton,
      incrementButton
    ] = [...elem.shadowRoot.querySelectorAll('ids-button')];

    do {
      incrementButton.click();
    } while (parseInt(elem.value) < elem.max);

    expect(parseInt(elem.value)).toEqual(parseInt(elem.max));

    incrementButton.click();
    expect(parseInt(elem.value)).toEqual(parseInt(elem.max));

    decrementButton.click();
    await processAnimFrame();

    expect(parseInt(elem.value))
      .toEqual(parseInt(elem.max) - parseInt(elem.step));
  });

  it('decrements the value until min, and then cannot decrement anymore', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const [
      decrementButton,
      incrementButton
    ] = [...elem.shadowRoot.querySelectorAll('ids-button')];

    do {
      decrementButton.click();
      await processAnimFrame();
    } while (parseInt(elem.value) > elem.min);

    expect(parseInt(elem.value)).toEqual(parseInt(elem.min));

    decrementButton.click();
    await processAnimFrame();
    expect(parseInt(elem.value)).toEqual(parseInt(elem.min));

    incrementButton.click();
    await processAnimFrame();

    expect(parseInt(elem.value))
      .toEqual(parseInt(elem.min) + parseInt(elem.step));
  });

  it('presses the ArrowUp key to increment after clicking the input', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const initialValue = parseInt(elem.value);
    const step = parseInt(elem.step);
    elem.focus();
    elem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await processAnimFrame();

    expect(parseInt(elem.value)).toEqual(initialValue + step);
  });

  it('presses the ArrowDown key to decrement after clicking the input', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    const initialValue = parseInt(elem.value);
    const step = parseInt(elem.step);
    elem.focus();
    elem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await processAnimFrame();

    expect(parseInt(elem.value)).toEqual(initialValue - step);
  });
});
