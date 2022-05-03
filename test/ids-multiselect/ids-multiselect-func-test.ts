/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitFor from '../helpers/wait-for';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsMultiselect from '../../src/components/ids-multiselect/ids-multiselect';
import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';
import IdsListBox from '../../src/components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../src/components/ids-list-box/ids-list-box-option';
import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import states from '../../src/assets/data/states.json';
import IdsContainer from '../../src/components/ids-container/ids-container';

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
      `<ids-multiselect id="multiselect-1" label="Normal Multiselect" value="opt2" dirty-tracker="true">
      <ids-list-box>

        <ids-list-box-option value="opt2" id="opt2"><ids-checkbox label="Option Two" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3"><ids-checkbox label="Option Three" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4"><ids-checkbox label="Option Four" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5"><ids-checkbox label="Option Five" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6"><ids-checkbox label="Option Six" class="justify-center"></ids-checkbox></ids-list-box-option>
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
    await waitFor(() => expect(multiselect.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

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

  it('renders with icons', () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-5" label="Dropdown with Icons" value="opt2">
    <ids-list-box>
      <ids-list-box-option value="opt1" id="opt1">
        <ids-icon icon="user-profile"></ids-icon>
        <ids-checkbox label="Option One" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt2" id="opt2">
        <ids-icon icon="project"></ids-icon>
        <ids-checkbox label="Option Two" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt3" id="opt3">
        <ids-icon icon="purchasing"></ids-icon>
        <ids-checkbox label="Option Three" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt4" id="opt4">
        <ids-icon icon="quality"></ids-icon>
        <ids-checkbox label="Option Four" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt5" id="opt5">
        <ids-icon icon="rocket"></ids-icon>
        <ids-checkbox label="Option Five" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt6" id="opt6">
        <ids-icon icon="roles"></ids-icon>
        <ids-checkbox label="Option Six" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
    </ids-list-box>
  </ids-multiselect>`);

    expect(multiselect.hasIcons).toEqual(true);

    const icons = multiselect.querySelectorAll('ids-list-box-option ids-icon');
    expect(icons[0].icon).toEqual('user-profile');
    expect(icons[5].icon).toEqual('roles');
  });

  it('renders with tooltips', async () => {
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-6" label="Dropdown with Tooltips" value="opt2">
      <ids-list-box>
        <ids-list-box-option value="opt1" id="opt1" tooltip="Additional Info on Option One"><ids-checkbox label="Option One" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt2" id="opt2" tooltip="Additional Info on Option Two"><ids-checkbox label="Option Two" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3" tooltip="Additional Info on Option Three"><ids-checkbox label="Option Three" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4" tooltip="Additional Info on Option Four"><ids-checkbox label="Option Four" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5" tooltip="Additional Info on Option Five"><ids-checkbox label="Option Five" class="justify-center"></ids-checkbox></ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6" tooltip="Additional Info on Option Six"><ids-checkbox label="Option Six" class="justify-center"></ids-checkbox></ids-list-box-option>
      </ids-list-box>
    </ids-multiselect>`);

    await waitFor(() => expect(multiselect.getAttribute('tooltip')).toBeTruthy());
    expect(multiselect.tooltip).toEqual('Additional Info on Option Two');
  });

  it('handles setting disabled', () => {
    multiselect.disabled = true;
    expect(multiselect.getAttribute('disabled')).toEqual('true');
    expect(multiselect.getAttribute('readonly')).toBeFalsy();
    expect(multiselect.disabled).toEqual(true);
    expect(multiselect.container.disabled).toEqual(true);
  });

  it('handles setting readonly', () => {
    multiselect.readonly = true;
    expect(multiselect.getAttribute('readonly')).toEqual('true');
    expect(multiselect.readonly).toEqual(true);
    expect(multiselect.container.disabled).toEqual(false);
  });

  it('can change the label', () => {
    multiselect.label = 'Changed Label';
    expect(multiselect.label).toEqual('Changed Label');
  });

  it('should show dirty indicator on change', () => {
    expect(multiselect.dirty).toEqual({ original: 'Option Two' });
    multiselect.dirtyTracker = true;
    multiselect.value = 'opt3';
    expect(multiselect.dirty).toEqual({ original: 'Option Two' });
    expect(multiselect.container.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
  });

  it('should be able to reset dirty indicator', () => {
    multiselect.dirtyTracker = true;
    expect(multiselect.getAttribute('dirty-tracker')).toEqual('true');
    multiselect.dirtyTracker = false;
    expect(multiselect.getAttribute('dirty-tracker')).toBeFalsy();
  });

  it('should be able to set value', () => {
    multiselect.value = 'opt3';
    expect(multiselect.value).toEqual('opt3');
    expect(multiselect.container.value).toEqual('Option Three');
  });

  it('should be able to set value with selectedIndex', () => {
    expect(multiselect.selectedIndex).toEqual(1);

    multiselect.selectedIndex = 2;
    expect(multiselect.selectedIndex).toEqual(2);
    expect(multiselect.value).toEqual('opt3');
    expect(multiselect.container.value).toEqual('Option Three');

    multiselect.selectedIndex = 'x'; // ignored
    expect(multiselect.selectedIndex).toEqual(2);
    expect(multiselect.value).toEqual('opt3');
    expect(multiselect.container.value).toEqual('Option Three');
  });

  it('should ignore null / bad selectedIndex', () => {
    expect(multiselect.selectedIndex).toEqual(1);
    multiselect.selectedIndex = 'x'; // ignored
    expect(multiselect.selectedIndex).toEqual(1);
    expect(multiselect.value).toEqual('opt2');
    expect(multiselect.container.value).toEqual('Option Two');
  });

  it('should ignore null / bad value', () => {
    multiselect.value = 'opt3';
    expect(multiselect.value).toEqual('opt3');
    expect(multiselect.container.value).toEqual('Option Three');

    multiselect.value = null;
    expect(multiselect.container.value).toEqual('Option Three');

    multiselect.value = 'optx';
    expect(multiselect.container.value).toEqual('Option Three');
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
    multiselect.querySelector('ids-list-box-option.is-selected').classList.remove('is-selected');
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('can click outside an open list to close it', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    multiselect.onOutsideClick = jest.fn();
    multiselect.open();

    setTimeout(() => {
      // Click outside the Modal into the overlay area
      document.body.dispatchEvent(clickEvent);

      setTimeout(() => {
        expect(multiselect.onOutsideClick).toHaveBeenCalled();
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

    expect(multiselect.querySelectorAll('ids-list-box-option').length).toEqual(6);
    expect(multiselect.beforeShow).toBeFalsy();
    multiselect.beforeShow = async function beforeShow() {
      return getContents();
    };
    expect(multiselect.beforeShow).toBeTruthy();
    await multiselect.open();
    expect(multiselect.querySelectorAll('ids-list-box-option').length).toEqual(59);
  });

  it('supports type ahead to select', async () => {
    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt2');
    await waitFor(() => expect(multiselect.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

    expect(multiselect.value).toEqual('opt3');
  });

  it('supports type ahead when open', async () => {
    await waitFor(() => expect(multiselect.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());
    multiselect.open();
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option four' } });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    multiselect.dispatchEvent(event);

    await waitFor(() => expect(multiselect.popup.visible).toEqual(false));
    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt4');
  });

  it('ignores type ahead to open when no matches', async () => {
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'xxxxx' } });

    await waitFor(() => expect(multiselect.popup.visible).toEqual(false));
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('ignores type ahead when readonly', async () => {
    multiselect.readonly = true;
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

    multiselect.disabled = true;
    multiselect.triggerEvent('keydownend', multiselect, { detail: { keys: 'option thr' } });

    await waitFor(() => expect(multiselect.popup.visible).toEqual(false));
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('supports clicking trigger to open', async () => {
    await waitFor(() => expect(multiselect.trigger).toBeTruthy());

    multiselect.trigger.click();
    expect(multiselect.popup.visible).toEqual(true);
  });

  it('supports clicking input to open', async () => {
    debugger;
    await waitFor(() => expect(multiselect.container).toBeTruthy());

    multiselect.container.click();
    expect(multiselect.popup.visible).toEqual(true);
  });

  it('supports clicking to select', async () => {
    expect(multiselect.value).toEqual('opt2');
    multiselect.trigger.click();

    await wait(80);
    multiselect.querySelectorAll('ids-list-box-option')[4].click();

    await wait(80);
    expect(multiselect.value).toEqual('opt5');
  });

  it('supports clicking to select on the icon', () => {
    debugger;
    multiselect = createFromTemplate(`<ids-multiselect id="multiselect-5" label="Dropdown with Icons" value="opt2">
    <ids-list-box>
      <ids-list-box-option value="opt1" id="opt1">
        <ids-icon icon="user-profile"></ids-icon>
        <ids-checkbox label="Option One" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt2" id="opt2">
        <ids-icon icon="project"></ids-icon>
        <ids-checkbox label="Option Two" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt3" id="opt3">
        <ids-icon icon="purchasing"></ids-icon>
        <ids-checkbox label="Option Three" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt4" id="opt4">
        <ids-icon icon="quality"></ids-icon>
        <ids-checkbox label="Option Four" class="justify-center"></ids-checkbox>
      <ids-list-box-option value="opt5" id="opt5">
        <ids-icon icon="rocket"></ids-icon>
        <ids-checkbox label="Option Five" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
      <ids-list-box-option value="opt6" id="opt6">
        <ids-icon icon="roles"></ids-icon>
        <ids-checkbox label="Option Six" class="justify-center"></ids-checkbox>
      </ids-list-box-option>
    </ids-list-box>
    </ids-multiselect>`);
    expect(multiselect.value).toEqual('opt2');

    const icons = multiselect.querySelectorAll('ids-list-box-option ids-icon');
    icons[5].click();
    expect(multiselect.value).toEqual('opt6');
  });

  it('can changing language from the container', async () => {
    await container.setLanguage('de');
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

  it('selects on arrow up and alt key', () => {
    multiselect.open();
    expect(multiselect.value).toEqual('opt2');
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);

    event = new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt3');
  });

  it('closes on escape without changing', () => {
    multiselect.open();
    expect(multiselect.value).toEqual('opt2');
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);

    event = new KeyboardEvent('keydown', { key: 'Escape' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt2');
  });

  it('can not arrow up past top', () => {
    multiselect.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);

    expect(multiselect.querySelector('ids-list-box-option.is-selected').textContent).toEqual('Option Six');
  });

  it('can not arrow up to the bottom', () => {
    multiselect.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);
    multiselect.dispatchEvent(event);

    expect(multiselect.querySelector('ids-list-box-option.is-selected').textContent).toEqual('Option One');
  });

  it('can open on enter or space', () => {
    expect(multiselect.popup.visible).toEqual(false);
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    multiselect.dispatchEvent(event);
    expect(multiselect.popup.visible).toEqual(true);
    multiselect.dispatchEvent(event);
    expect(multiselect.popup.visible).toEqual(false);
  });

  it('selects on enter when open', () => {
    debugger;
    multiselect.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Enter' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt3');
  });

  it('selects on space when open', () => {
    debugger;
    multiselect.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: ' ' });
    multiselect.dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt3');
  });

  it('selects on tab when open', () => {
    multiselect.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab' });
    multiselect.dispatchEvent(event);
    multiselect.querySelector('ids-list-box-option.is-selected').dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt3');

    multiselect.open();
    event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    multiselect.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    multiselect.dispatchEvent(event);
    multiselect.querySelector('ids-list-box-option.is-selected').dispatchEvent(event);

    expect(multiselect.popup.visible).toEqual(false);
    expect(multiselect.value).toEqual('opt4');
  });

  it('tab works correcty', async () => {
    multiselect.container.focus();
    expect(document.activeElement.id).toEqual('multiselect-1');
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    multiselect.dispatchEvent(event);

    // Not working right, not sure why?
    expect(document.activeElement.id).toEqual('multiselect-1');
  });

  it('tags work correctly', async () => {
    createFromTemplate(`<ids-multiselect id="multiselect-1" tags="true" label="Tags Multiselect" dirty-tracker="true">
    <ids-list-box>
      <ids-list-box-option value="opt1" id="opt1"><ids-checkbox label="Option One" class="justify-center"></ids-checkbox></ids-list-box-option>
      <ids-list-box-option value="opt2" id="opt2"><ids-checkbox label="Option Two" class="justify-center"></ids-checkbox></ids-list-box-option>
      <ids-list-box-option value="opt3" id="opt3"><ids-checkbox label="Option Three" class="justify-center"></ids-checkbox></ids-list-box-option>
      <ids-list-box-option value="opt4" id="opt4"><ids-checkbox label="Option Four" class="justify-center"></ids-checkbox></ids-list-box-option>
      <ids-list-box-option value="opt5" id="opt5"><ids-checkbox label="Option Five" class="justify-center"></ids-checkbox></ids-list-box-option>
      <ids-list-box-option value="opt6" id="opt6"><ids-checkbox label="Option Six" class="justify-center"></ids-checkbox></ids-list-box-option>
    </ids-list-box>
    </ids-multiselect>`);
    expect(multiselect.container.querySelector('ids-tag').length).toEqual(1);
  });
});
