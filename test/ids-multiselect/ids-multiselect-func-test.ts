/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitForTimeout from '../helpers/wait-for-timeout';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsMultiselect from '../../src/components/ids-multiselect/ids-multiselect';
import '../../src/components/ids-dropdown/ids-dropdown';
import '../../src/components/ids-dropdown/ids-dropdown-list';
import '../../src/components/ids-list-box/ids-list-box';
import '../../src/components/ids-list-box/ids-list-box-option';
import '../../src/components/ids-trigger-field/ids-trigger-field';
import states from '../../src/assets/data/states.json';

import IdsContainer from '../../src/components/ids-container/ids-container';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import IdsGlobal from '../../src/components/ids-global/ids-global';

describe('IdsMultiselect Component', () => {
  let multiselect: any;
  let container: any;

  const createFromTemplate = (innerHTML:any) => {
    multiselect?.remove();
    container?.remove();

    container = new IdsContainer();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    multiselect = template.content.childNodes[0];

    container.appendChild(multiselect);
    document.body.appendChild(container);
    return multiselect;
  };

  beforeEach(async () => {
    multiselect = createFromTemplate(
      `<ids-multiselect id="multiselect-1" label="Normal Multiselect" dirty-tracker="true">
        <ids-list-box>
          <ids-list-box-option value="opt2" id="opt2" selected><ids-checkbox label="Option Two" tooltip="Additional Info on Option Two"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option value="opt3" id="opt3"><ids-checkbox label="Option Three" tooltip="Additional Info on Option Three"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option value="opt4" id="opt4"><ids-checkbox label="Option Four" tooltip="Additional Info on Option Four"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option value="opt5" id="opt5"><ids-checkbox label="Option Five" tooltip="Additional Info on Option Five"></ids-checkbox></ids-list-box-option>
          <ids-list-box-option value="opt6" id="opt6"><ids-checkbox label="Option Six" tooltip="Additional Info on Option Six"></ids-checkbox></ids-list-box-option>
        </ids-list-box>
      </ids-multiselect>`
    );
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders empty multiselect with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    multiselect.remove();
    const elem:any = new IdsMultiselect();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-multiselect').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(multiselect.outerHTML).toMatchSnapshot();
  });

  it('renders with disabled', () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-1" disabled="true" label="Test"></ids-multiselect>`);
    expect(multiselect.disabled).toBeTruthy();
  });

  it('renders with readonly', () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-1" readonly="true" label="Test"></ids-multiselect>`);
    expect(multiselect.readonly).toBeTruthy();
  });

  it('can set readonly', () => {
    multiselect.readonly = true;
    expect(multiselect.readonly).toEqual(true);
    expect(multiselect.getAttribute('readonly')).toBeTruthy();

    multiselect.readonly = false;
    expect(multiselect.readonly).toEqual(false);
    expect(multiselect.getAttribute('readonly')).toBeFalsy();

    multiselect.setAttribute('readonly', 'true');
    expect(multiselect.readonly).toEqual(true);
    expect(multiselect.getAttribute('readonly')).toBeTruthy();

    multiselect.removeAttribute('readonly');
    expect(multiselect.readonly).toEqual(false);
    expect(multiselect.getAttribute('readonly')).toBeFalsy();
  });

  it('can set disabled', () => {
    multiselect.disabled = true;
    expect(multiselect.disabled).toEqual(true);
    expect(multiselect.getAttribute('disabled')).toBeTruthy();

    multiselect.disabled = false;
    expect(multiselect.disabled).toEqual(false);
    expect(multiselect.getAttribute('disabled')).toBeFalsy();

    multiselect.setAttribute('disabled', 'true');
    expect(multiselect.disabled).toEqual(true);
    expect(multiselect.getAttribute('disabled')).toBeTruthy();

    multiselect.removeAttribute('disabled');
    expect(multiselect.disabled).toEqual(false);
    expect(multiselect.getAttribute('disabled')).toBeFalsy();
  });

  it('renders with validation', () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-1" validate="required" validation-events="blur change" label="Test"></ids-multiselect>`);
    expect(multiselect.validate).toEqual('required');
    expect(multiselect.validationEvents).toEqual('blur change');

    // Generate from the parent defaults
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-1" validate="required" label="Test"></ids-multiselect>`);
    multiselect.validationEvents = 'blur change';
    expect(multiselect.validate).toEqual('required');
    expect(multiselect.validationEvents).toEqual('blur change');

    // Default Case
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-1" validate="required" label="Test"></ids-multiselect>`);
    expect(multiselect.validate).toEqual('required');
    expect(multiselect.validationEvents).toEqual('change');
  });

  it('supports validation', async () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-5" label="Dropdown with Icons" validate="true">
     </ids-multiselect>`);
    await waitForTimeout(() => expect(multiselect.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

    multiselect.validate = 'required';
    multiselect.validationEvents = 'blur change';
    multiselect.triggerEvent('change', multiselect);
    expect(multiselect.getAttribute('validate')).toEqual('required');
  });

  it('can reset validation and validation-events', async () => {
    multiselect.validate = 'required';
    multiselect.validationEvents = 'blur change';
    multiselect.validate = null;
    multiselect.validationEvents = null;
    expect(multiselect.getAttribute('validate')).toBeFalsy();
    expect(multiselect.getAttribute('validation-events')).toBeFalsy();
  });

  it('handles setting disabled', () => {
    multiselect.disabled = true;
    expect(multiselect.getAttribute('disabled')).toEqual('true');
    expect(multiselect.getAttribute('readonly')).toBeFalsy();
    expect(multiselect.disabled).toEqual(true);
    expect(multiselect.input.disabled).toEqual(true);
  });

  it('handles setting readonly', () => {
    multiselect.readonly = true;
    expect(multiselect.getAttribute('readonly')).toEqual('true');
    expect(multiselect.readonly).toEqual(true);
    expect(multiselect.input.disabled).toEqual(false);
  });

  it('can change the label', () => {
    multiselect.label = 'Changed Label';
    expect(multiselect.label).toEqual('Changed Label');
  });

  it('should be able to reset dirty indicator', () => {
    multiselect.dirtyTracker = true;
    expect(multiselect.getAttribute('dirty-tracker')).toEqual('true');
    multiselect.dirtyTracker = false;
    expect(multiselect.getAttribute('dirty-tracker')).toBeFalsy();
  });

  it('should be able to set value', () => {
    multiselect.value = ['opt3'];
    expect(multiselect.value).toContain('opt3');
  });

  it('should ignore null / bad value', () => {
    multiselect.value = ['opt3'];
    expect(multiselect.value).toContain('opt3');

    multiselect.value = null;
    expect(multiselect.value).toContain('opt3');

    multiselect.value = ['optx'];
    expect(multiselect.value).toContain('opt3');
  });

  it('supports opening the list with open', async () => {
    expect(multiselect.popup.visible).toEqual(false);
    await multiselect.open();
    expect(multiselect.popup.visible).toEqual(true);
    multiselect.close();
    expect(multiselect.popup.visible).toEqual(false);
    multiselect.readonly = true;
    await multiselect.open();
    expect(multiselect.popup.visible).toEqual(false);
    multiselect.disabled = true;
    await multiselect.open();
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('supports opening the list with toggle', async () => {
    expect(multiselect.popup.visible).toEqual(false);
    multiselect.toggle();
    expect(multiselect.popup.visible).toEqual(true);
    multiselect.toggle();
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('supports closing the list with closing', async () => {
    expect(multiselect.popup.visible).toEqual(false);
    multiselect.open();
    expect(multiselect.popup.visible).toEqual(true);
    multiselect.close();
    expect(multiselect.popup.visible).toEqual(false);
    multiselect.open();
    expect(multiselect.popup.visible).toEqual(true);
    multiselect.close(true);
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('can click outside an open list to close it', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    multiselect.dropdownList.onOutsideClick = jest.fn();
    multiselect.open();

    setTimeout(() => {
      // Click outside the Modal into the overlay area
      document.body.dispatchEvent(clickEvent);

      setTimeout(() => {
        expect(multiselect.dropdownList.onOutsideClick).toHaveBeenCalled();
        done();
      });
    }, 70);
  });

  it('supports async beforeShow', async () => {
    const getContents = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve(states);
      }, 1);
    });

    expect(multiselect.querySelectorAll('ids-list-box-option').length).toEqual(5);
    expect(multiselect.beforeShow).toBeFalsy();
    multiselect.beforeShow = async function beforeShow() {
      return getContents();
    };
    expect(multiselect.beforeShow).toBeTruthy();
    await multiselect.open();
    expect(await multiselect.querySelectorAll('ids-list-box-option').length).toEqual(59);
  });

  it('ignores type ahead to open when no matches', async () => {
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'xxxxx' } });

    await waitForTimeout(() => expect(multiselect.popup.visible).toEqual(false));
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('ignores type ahead when readonly', async () => {
    multiselect.readonly = true;
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

    multiselect.disabled = true;
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

    await waitForTimeout(() => expect(multiselect.popup.visible).toEqual(false));
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('supports clicking trigger to open', async () => {
    await waitForTimeout(() => expect(multiselect.trigger).toBeTruthy());

    multiselect.trigger.click();
    expect(multiselect.popup.visible).toEqual(true);
  });

  it('supports clicking input to open', async () => {
    await waitForTimeout(() => expect(multiselect.container).toBeTruthy());
    multiselect.input.shadowRoot.querySelector('.field-container').click();
    await waitForTimeout(() => expect(multiselect.popup.visible).toBeTruthy());
    expect(multiselect.popup.visible).toEqual(true);
  });

  it('supports clicking to select', async () => {
    expect(multiselect.value).toContain('opt2');
    multiselect.trigger.click();

    await wait(80);

    multiselect.querySelectorAll('ids-list-box-option')[4].click();

    await wait(80);
    expect(multiselect.value).toContain('opt6');
    expect(multiselect.value).toContain('opt2');
  });

  it('can changing language from the container', async () => {
    IdsGlobal.getLocale().loadedLanguages.set('de', deMessages);
    await IdsGlobal.getLocale().setLanguage('de');
    await processAnimFrame();
    expect(multiselect.getAttribute('aria-description')).toEqual('Drücken Sie zum Auswählen die Nach-unten-Taste');
  });

  it('opens on arrow down', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(true);
  });

  it('ignores arrow down on open', () => {
    multiselect.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(true);
  });

  it('opens on arrow up', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(true);
  });

  it('opens on enter', () => {
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(true);
  });

  it.skip('selects on space/enter when open', () => {
    multiselect.value = [];
    multiselect.open();
    multiselect.dropdownList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    multiselect.dropdownList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    multiselect.dropdownList.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    multiselect.dropdownList.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));

    multiselect.close();
    expect(multiselect.value).toEqual(['opt5']);
  });

  it('should set/unset tags attribute', () => {
    multiselect.tags = true;
    expect(multiselect.tags).toBeTruthy();
    multiselect.tags = false;
    expect(multiselect.tags).toBeFalsy();
  });

  it('should set/unset max attribute', () => {
    multiselect.max = 5;
    expect(multiselect.max).toEqual(5);
    multiselect.max = null;
    expect(multiselect.max).toBeNaN();
  });

  it('tags work correctly', async () => {
    createFromTemplate(`<ids-multiselect id="multiselect-1" tags="true" label="Tags Multiselect" dirty-tracker="true">
      <ids-list-box>
        <ids-list-box-option value="opt1"><ids-checkbox label="Option One" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt2"><ids-checkbox label="Option Two" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3"><ids-checkbox label="Option Three" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4"><ids-checkbox label="Option Four" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5"><ids-checkbox label="Option Five" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6"><ids-checkbox label="Option Six" class="justify-center"></ids-checkbox></ids-list-box-option>
      </ids-list-box>
    </ids-multiselect>`);
    multiselect.value = ['opt1'];
    expect(multiselect.input.querySelectorAll('ids-tag').length).toEqual(1);

    multiselect.input.querySelector('ids-icon')?.dispatchEvent(new MouseEvent('click'));
    expect(multiselect.value).toEqual([]);

    multiselect.value = ['opt1'];
    multiselect.disabled = true;
    multiselect.value = ['opt1', 'opt2'];

    expect([...multiselect.input.querySelectorAll('ids-tag')].every((item) => item.hasAttribute('disabled'))).toBeTruthy();

    multiselect.disabled = false;
    multiselect.value = [];
    multiselect.open();

    multiselect.querySelector('ids-list-box-option')?.click();

    expect(multiselect.value).toEqual(['opt1']);
  });

  it('should handle overflowed text', async () => {
    multiselect = createFromTemplate(
      `<ids-multiselect label="Overflow text multiselect">
        <ids-list-box>
          <ids-list-box-option value="opt1" id="opt1" selected>Option One</ids-list-box-option>
          <ids-list-box-option value="opt2" id="opt2" selected>Option Two</ids-list-box-option>
          <ids-list-box-option value="opt3" id="opt3" selected>Option Three</ids-list-box-option>
        </ids-list-box>
      </ids-multiselect>`
    );
    const getText = () => multiselect.input.querySelector('ids-text');

    expect(multiselect.value).toEqual(['opt1', 'opt2', 'opt3']);
    expect(getText()?.textContent).toEqual('Option One, Option Two, Option Three');

    multiselect.value = ['opt1'];

    expect(getText()?.textContent).toEqual('Option One');

    multiselect.value = [];

    expect(getText()?.textContent).toBe('');
  });
});
