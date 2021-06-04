/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import simulateMouseDownEvents from '../helpers/simulate-mouse-down-events';
import IdsSpinbox from '../../src/ids-spinbox';

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

  afterEach(async () => {
    elem?.remove();
    document.innerHTML = '';
  });

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

    await simulateMouseDownEvents({ element: incrementButton });

    expect(parseInt(elem.value)).toEqual(initialValue + step);

    await simulateMouseDownEvents({ element: decrementButton });
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
      await simulateMouseDownEvents({ element: incrementButton });
    } while (parseInt(elem.value) < elem.max);

    expect(parseInt(elem.value)).toEqual(parseInt(elem.max));

    await simulateMouseDownEvents({ element: incrementButton });
    expect(parseInt(elem.value)).toEqual(parseInt(elem.max));
    await simulateMouseDownEvents({ element: decrementButton });
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
      await simulateMouseDownEvents({ element: decrementButton });
      await processAnimFrame();
    } while (parseInt(elem.value) > elem.min);

    expect(parseInt(elem.value)).toEqual(parseInt(elem.min));

    await simulateMouseDownEvents({ element: decrementButton });
    await processAnimFrame();
    expect(parseInt(elem.value)).toEqual(parseInt(elem.min));

    await simulateMouseDownEvents({ element: incrementButton });
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

  // Note: JSDOM doesn't accept pointer events so
  // cannot test the inverse here

  it('clicks the label and input receives focus', async () => {
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);
    const labelEl = elem.shadowRoot.querySelector('.ids-spinbox').children[0];
    labelEl.click();

    expect(elem.shadowRoot.activeElement).toEqual(elem.input);
  });

  it('renders a spinbox with a dirty tracker, then removes it with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createElemViaTemplate(
      `<ids-spinbox
        value="0"
        dirty-tracker
      ></ids-spinbox>`
    );
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(elem.dirtyTracker).toEqual('true');

    elem.dirtyTracker = false;
    expect(elem.dirtyTracker).toEqual(null);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with the validation required attribute without errors', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      `<ids-spinbox validate="required"></ids-spinbox>`
    );
    expect(elem.shadowRoot.querySelector('.validation-message')).not.toBeNull();

    elem.validate = undefined;
    expect(elem.shadowRoot.querySelector('.validation-message')).toBeNull();

    elem.validate = true;
    expect(elem.shadowRoot.querySelector('.validation-message')).not.toBeNull();

    expect(errors).not.toHaveBeenCalled();
  });

  it('toggles the disabled state with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);

    elem.disabled = true;
    expect(elem.disabled).toEqual('true');

    elem.disabled = false;
    expect(elem.disabled).toEqual(null);

    expect(errors).not.toHaveBeenCalled();
  });

  it('gets input text changed manually and overall value updates', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createElemViaTemplate(DEFAULT_SPINBOX_HTML);
    elem.input.focus();
    elem.input.value = 10;

    await processAnimFrame();
    expect(elem.value).toEqual('10');

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with readonly set, then toggles it off with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createElemViaTemplate(
      `<ids-spinbox readonly value="10"></ids-spinbox>`
    );
    expect(elem.readonly).not.toBeNull();

    elem.setAttribute('readonly', false);
    expect(elem.readonly).toBeNull();

    expect(errors).not.toHaveBeenCalled();
  });

  it('toggling disabled and renderonly states preserves provides proper'
  + ' disabled states', async () => {
    elem = await createElemViaTemplate(
      `<ids-spinbox readonly value="10"></ids-spinbox>`
    );

    elem.setAttribute('disabled', true);
    await processAnimFrame();

    const idsButtons = [...elem.shadowRoot.querySelectorAll('ids-button')];

    expect(idsButtons.find((el) => !el.hasAttribute('disabled'))).toEqual(undefined);

    elem.removeAttribute('readonly');
    await processAnimFrame();

    expect(idsButtons.find((el) => !el.hasAttribute('disabled'))).toEqual(undefined);
    expect(elem.readonly).toBeNull();

    elem.removeAttribute('disabled');
    await processAnimFrame();

    expect(idsButtons.find((el) => el.hasAttribute('disabled'))).toEqual(undefined);
    expect(elem.disabled).toBeNull();

    elem.readonly = true;
    await processAnimFrame();

    expect(idsButtons.find((el) => !el.hasAttribute('disabled'))).toEqual(undefined);
    expect(elem.readonly).not.toBeNull();

    elem.setAttribute('disabled', true);
    await processAnimFrame();

    elem.removeAttribute('disabled');
    await processAnimFrame();

    expect(idsButtons.find((el) => !el.hasAttribute('disabled'))).toEqual(undefined);
    expect(elem.readonly).not.toBeNull();
    expect(elem.disabled).toBeNull();
  });

  it('changes the value in input to empty, then presses increment button '
  + 'and value is += increment step', async () => {
    const value = 10;
    elem = await createElemViaTemplate(
      `<ids-spinbox readonly value="${value}"></ids-spinbox>`
    );

    elem.input.input.value = '';
    await processAnimFrame();

    const [
      decrementButton,
      incrementButton
    ] = [...elem.shadowRoot.querySelectorAll('ids-button')];

    await simulateMouseDownEvents({ element: incrementButton });
    await processAnimFrame();

    expect(elem.value).toEqual(`${value + 1}`);
  });
});
