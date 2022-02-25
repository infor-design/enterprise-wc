/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import createFromTemplate from '../helpers/create-from-template';
import waitFor from '../helpers/wait-for';
import simulateMouseDownEvents from '../helpers/simulate-mouse-down-events';
import IdsSpinbox from '../../src/components/ids-spinbox/ids-spinbox';
import IdsContainer from '../../src/components/ids-container/ids-container';

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
  let container;

  afterEach(async () => {
    elem?.remove();
    container?.remove();

    elem = null;
    container = null;
    document.innerHTML = '';
  });

  it('renders from HTML Template with no errors', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('removes max value and then can set value with no ceiling', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.max = '';
    elem.value = 10000;
    expect(elem.value).toEqual('10000');
  });

  it('sets the label placeholder with no errors', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.placeholder = 'This is helpful';
    expect(elem.placeholder).toEqual('This is helpful');

    elem.label = 'Heading 1';
    expect(elem.label).toEqual('Heading 1');
  });

  it('removes min value and then can set value with no floor', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.min = '';
    elem.value = -10000;
    expect(elem.value).toEqual('-10000');
  });

  it('updates min value but can only set a value to min floor', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.min = -10000;
    elem.value = -100000;
    expect(elem.value).toEqual('-10000');
  });

  it('updates max value but can only set a value to max ceiling', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.max = 10000;
    elem.value = 100000;
    expect(elem.value).toEqual('10000');
  });

  it('renders from HTML Template with no errors', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('presses the increment and decrement buttons with no errors', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);

    const [
      decrementButton,
      incrementButton
    ] = [...elem.querySelectorAll('ids-trigger-button')];

    await simulateMouseDownEvents({ element: incrementButton });

    expect(elem.value).toEqual('5');

    await simulateMouseDownEvents({ element: decrementButton });
    await processAnimFrame();

    expect(elem.value).toEqual('0');
    expect(errors).not.toHaveBeenCalled();
  });

  it('increments the value until max, and then cannot increment anymore', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    const [
      /* eslint-disable no-unused-vars */
      decrementButton,
      incrementButton
    ] = [...elem.querySelectorAll('ids-trigger-button')];

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
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    const [
      decrementButton,
      incrementButton
    ] = [...elem.querySelectorAll('ids-trigger-button')];

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
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);
    elem.focus();
    elem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    await processAnimFrame();

    expect(elem.value).toEqual('5');
  });

  it('presses the ArrowDown key to decrement after clicking the input', async () => {
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);
    elem.focus();
    elem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    await processAnimFrame();

    expect(elem.value).toEqual('-5');
  });

  it('renders a spinbox with a dirty tracker, then removes it with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, `<ids-spinbox
        value="0"
        dirty-tracker="true"
      ></ids-spinbox>`);
    expect(document.querySelectorAll('ids-spinbox').length).toEqual(1);
    expect(elem.dirtyTracker).toEqual('true');

    elem.dirtyTracker = false;
    expect(elem.dirtyTracker).toEqual(null);
    expect(errors).not.toHaveBeenCalled();
  });

  it('toggles the disabled state with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = await createFromTemplate(elem, DEFAULT_SPINBOX_HTML);

    elem.disabled = true;
    expect(elem.disabled).toBeTruthy();

    elem.disabled = false;
    expect(elem.disabled).toBeFalsy();

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with readonly set, then toggles it off with no issues', async () => {
    const errors = jest.spyOn(global.console, 'error');

    elem = await createFromTemplate(elem, `<ids-spinbox readonly value="10"></ids-spinbox>`);
    expect(elem.readonly).toBeTruthy();

    elem.setAttribute('readonly', false);
    expect(elem.readonly).toBeFalsy();

    expect(errors).not.toHaveBeenCalled();
  });

  it('disables its trigger buttons if the field is disabled or readonly', async () => {
    elem = await createFromTemplate(elem, `<ids-spinbox readonly value="10"></ids-spinbox>`);

    const getIdsButtons = () => (
      [...elem.querySelectorAll('ids-trigger-button')]
    );

    await waitFor(() => expect(
      getIdsButtons().find((el) => el.hasAttribute('disabled'))
    ).not.toEqual(undefined));

    elem.removeAttribute('readonly');
    elem.setAttribute('disabled', true);

    await waitFor(() => expect(
      getIdsButtons().find((el) => el.hasAttribute('disabled'))
    ).not.toEqual(undefined));
  });

  // note this behavior should be more intelligent on iteration;
  // e.g. clearing input field shouldn't fall back to '' but
  // instead it should be previous input;

  // spinbox needs to track a previous "good" value input and seems
  // not most easy to streamline quickly so this is just current
  // behavior on an edge case

  it('changes the value in input to empty, then presses increment button '
  + 'and value is cleared then one added', async () => {
    const value = 10;
    elem = await createFromTemplate(elem, `<ids-spinbox readonly value="${value}"></ids-spinbox>`);
    elem.input.value = '';
    await processAnimFrame();
    await processAnimFrame();

    const [
      decrementButton,
      incrementButton
    ] = [...elem.querySelectorAll('ids-trigger-button')];

    await simulateMouseDownEvents({ element: incrementButton });
    await processAnimFrame();
    await processAnimFrame();

    expect(elem.value).toEqual('1');
  });

  it('sets the value to one not divisible by steps and has it auto-rounded to nearest-step in both '
  + 'directions', async () => {
    elem = await createFromTemplate(elem, `<ids-spinbox value="23" step="5"></ids-spinbox>`);

    expect(elem.value).toEqual('25');

    elem.value = '22';

    expect(elem.value).toEqual('20');
  });

  it('can change language from the container', async () => {
    container = await createFromTemplate(container, `<ids-container id="test-container">${DEFAULT_SPINBOX_HTML}</ids-container>`);
    elem = container.querySelector('ids-spinbox');

    container.language = 'de';
    await processAnimFrame();

    expect(elem.language.name).toEqual('de');
  });
});
