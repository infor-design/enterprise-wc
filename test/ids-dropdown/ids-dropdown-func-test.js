/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitFor from '../helpers/wait-for';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';
import IdsListBox from '../../src/components/ids-list-box/ids-list-box';
import IdsListBoxOption from '../../src/components/ids-list-box/ids-list-box-option';
import IdsTriggerField from '../../src/components/ids-trigger-field/ids-trigger-field';
import states from '../../demos/data/states.json';
import IdsContainer from '../../src/components/ids-container/ids-container';

describe('IdsDropdown Component', () => {
  let dropdown;
  let container;

  const createFromTemplate = (innerHTML) => {
    dropdown?.remove();
    container?.remove();

    container = new IdsContainer();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    dropdown = template.content.childNodes[0];

    container.appendChild(dropdown);
    document.body.appendChild(container);
    return dropdown;
  };

  beforeEach(async () => {
    dropdown = createFromTemplate(
      `<ids-dropdown id="dropdown-1" label="Normal Dropdown" value="opt2" dirty-tracker="true">
      <ids-list-box>
        <ids-list-box-option value="opt1" id="opt1">Option One</ids-list-box-option>
        <ids-list-box-option value="opt2" id="opt2">Option Two</ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3">Option Three</ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4">Option Four</ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5">Option Five</ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6">Option Six</ids-list-box-option>
      </ids-list-box>
    </ids-dropdown>`
    );
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders empty dropdown with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    dropdown.remove();
    const elem = new IdsDropdown();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-dropdown').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(dropdown.outerHTML).toMatchSnapshot();
  });

  it('renders with disabled', () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-1" disabled="true" label="Test"></ids-dropdown>`);
    expect(dropdown.disabled).toBeTruthy();
  });

  it('renders with readonly', () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-1" readonly="true" label="Test"></ids-dropdown>`);
    expect(dropdown.readonly).toBeTruthy();
  });

  it('can set readonly', () => {
    dropdown.readonly = true;
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.getAttribute('readonly')).toBeTruthy();

    dropdown.readonly = false;
    expect(dropdown.readonly).toEqual(false);
    expect(dropdown.getAttribute('readonly')).toBeFalsy();

    dropdown.setAttribute('readonly', 'true');
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.getAttribute('readonly')).toBeTruthy();

    dropdown.removeAttribute('readonly');
    expect(dropdown.readonly).toEqual(false);
    expect(dropdown.getAttribute('readonly')).toBeFalsy();
  });

  it('can set disabled', () => {
    dropdown.disabled = true;
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.getAttribute('disabled')).toBeTruthy();

    dropdown.disabled = false;
    expect(dropdown.disabled).toEqual(false);
    expect(dropdown.getAttribute('disabled')).toBeFalsy();

    dropdown.setAttribute('disabled', 'true');
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.getAttribute('disabled')).toBeTruthy();

    dropdown.removeAttribute('disabled');
    expect(dropdown.disabled).toEqual(false);
    expect(dropdown.getAttribute('disabled')).toBeFalsy();
  });

  it('renders with validation', () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-1" validate="required" validation-events="blur change" label="Test"></ids-dropdown>`);
    expect(dropdown.validate).toEqual('required');
    expect(dropdown.validationEvents).toEqual('blur change');

    // Generate from the parent defaults
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-1" validate="required" label="Test"></ids-dropdown>`);
    dropdown.validationEvents = 'blur change';
    expect(dropdown.validate).toEqual('required');
    expect(dropdown.validationEvents).toEqual('blur change');

    // Default Case
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-1" validate="required" label="Test"></ids-dropdown>`);
    expect(dropdown.validate).toEqual('required');
    expect(dropdown.validationEvents).toEqual('change');
  });

  it('supports validation', async () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-5" label="Dropdown with Icons" validate="true">
     </ids-dropdown>`);
    await waitFor(() => expect(dropdown.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

    dropdown.validate = 'required';
    dropdown.validationEvents = 'blur change';
    dropdown.triggerEvent('change', dropdown);
    expect(dropdown.getAttribute('validate')).toEqual('required');
  });

  it('can reset validation and validation-events', async () => {
    dropdown.validate = 'required';
    dropdown.validationEvents = 'blur change';
    dropdown.validate = null;
    dropdown.validationEvents = null;
    expect(dropdown.getAttribute('validate')).toBeFalsy();
    expect(dropdown.getAttribute('validation-events')).toBeFalsy();
  });

  it('renders with icons', () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-5" label="Dropdown with Icons" value="opt2">
    <ids-list-box>
      <ids-list-box-option value="opt1" id="opt1">
        <ids-icon icon="user-profile"></ids-icon>
        <span>Option One</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt2" id="opt2">
        <ids-icon icon="project"></ids-icon>
        <span>Option Two</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt3" id="opt3">
        <ids-icon icon="purchasing"></ids-icon>
        <span>Option Three</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt4" id="opt4">
        <ids-icon icon="quality"></ids-icon>
        <span>Option Four</span></ids-list-box-option>
      <ids-list-box-option value="opt5" id="opt5">
        <ids-icon icon="rocket"></ids-icon>
        <span>Option Five</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt6" id="opt6">
        <ids-icon icon="roles"></ids-icon>
        <span>Option Six</span>
      </ids-list-box-option>
    </ids-list-box>
  </ids-dropdown>`);

    expect(dropdown.hasIcons).toEqual(true);

    const icons = dropdown.querySelectorAll('ids-list-box-option ids-icon');
    expect(icons[0].icon).toEqual('user-profile');
    expect(icons[5].icon).toEqual('roles');
  });

  it('renders with tooltips', async () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-6" label="Dropdown with Tooltips" value="opt2">
      <ids-list-box>
        <ids-list-box-option value="opt1" id="opt1" tooltip="Additional Info on Option One">Option One</ids-list-box-option>
        <ids-list-box-option value="opt2" id="opt2" tooltip="Additional Info on Option Two">Option Two</ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3" tooltip="Additional Info on Option Three">Option Three</ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4" tooltip="Additional Info on Option Four">Option Four</ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5" tooltip="Additional Info on Option Five">Option Five</ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6" tooltip="Additional Info on Option Six">Option Six</ids-list-box-option>
      </ids-list-box>
    </ids-dropdown>`);

    await waitFor(() => expect(dropdown.getAttribute('tooltip')).toBeTruthy());
    expect(dropdown.tooltip).toEqual('Additional Info on Option Two');
  });

  it('handles setting disabled', () => {
    dropdown.disabled = true;
    expect(dropdown.getAttribute('disabled')).toEqual('true');
    expect(dropdown.getAttribute('readonly')).toBeFalsy();
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.container.disabled).toEqual(true);
  });

  it('handles setting readonly', () => {
    dropdown.readonly = true;
    expect(dropdown.getAttribute('readonly')).toEqual('true');
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.container.disabled).toEqual(false);
  });

  it('can change the label', () => {
    dropdown.label = 'Changed Label';
    expect(dropdown.label).toEqual('Changed Label');
  });

  it('should show dirty indicator on change', () => {
    expect(dropdown.dirty).toEqual({ original: 'Option Two' });
    dropdown.dirtyTracker = true;
    dropdown.value = 'opt3';
    expect(dropdown.dirty).toEqual({ original: 'Option Two' });
    expect(dropdown.container.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
  });

  it('should be able to reset dirty indicator', () => {
    dropdown.dirtyTracker = true;
    expect(dropdown.getAttribute('dirty-tracker')).toEqual('true');
    dropdown.dirtyTracker = false;
    expect(dropdown.getAttribute('dirty-tracker')).toBeFalsy();
  });

  it('should be able to set value', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.container.value).toEqual('Option Three');
  });

  it('should be able to set value with selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);

    dropdown.selectedIndex = 2;
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.container.value).toEqual('Option Three');

    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.container.value).toEqual('Option Three');
  });

  it('should ignore null / bad selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);
    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(1);
    expect(dropdown.value).toEqual('opt2');
    expect(dropdown.container.value).toEqual('Option Two');
  });

  it('should ignore null / bad value', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.container.value).toEqual('Option Three');

    dropdown.value = null;
    expect(dropdown.container.value).toEqual('Option Three');

    dropdown.value = 'optx';
    expect(dropdown.container.value).toEqual('Option Three');
  });

  it('supports opening the list with open', async () => {
    expect(dropdown.popup.visible).toEqual(false);
    await dropdown.open();
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.close();
    expect(dropdown.popup.visible).toEqual(false);
    dropdown.readonly = true;
    await dropdown.open();
    expect(dropdown.popup.visible).toEqual(false);
    dropdown.disabled = true;
    await dropdown.open();
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('supports opening the list with toggle', async () => {
    expect(dropdown.popup.visible).toEqual(false);
    dropdown.toggle();
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.toggle();
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('supports closing the list with closing', async () => {
    expect(dropdown.popup.visible).toEqual(false);
    dropdown.open();
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.close();
    expect(dropdown.popup.visible).toEqual(false);
    dropdown.open();
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.close(true);
    dropdown.querySelector('ids-list-box-option.is-selected').classList.remove('is-selected');
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('can click outside an open list to close it', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    dropdown.onOutsideClick = jest.fn();
    dropdown.open();

    setTimeout(() => {
      // Click outside the Modal into the overlay area
      document.body.dispatchEvent(clickEvent);

      setTimeout(() => {
        expect(dropdown.onOutsideClick).toHaveBeenCalled();
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

    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(6);
    expect(dropdown.beforeShow).toBeFalsy();
    dropdown.beforeShow = async function beforeShow() {
      return getContents();
    };
    expect(dropdown.beforeShow).toBeTruthy();
    await dropdown.open();
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(59);
  });

  it('supports type ahead to select', async () => {
    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt2');
    await waitFor(() => expect(dropdown.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());
    dropdown.triggerEvent('keydownend', dropdown, { detail: { keys: 'option thr' } });

    expect(dropdown.value).toEqual('opt3');
  });

  it('supports type ahead when open', async () => {
    await waitFor(() => expect(dropdown.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());
    dropdown.open();
    dropdown.triggerEvent('keydownend', dropdown, { detail: { keys: 'option four' } });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    dropdown.dispatchEvent(event);

    await waitFor(() => expect(dropdown.popup.visible).toEqual(false));
    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt4');
  });

  it('ignores type ahead to open when no matches', async () => {
    dropdown.triggerEvent('keydownend', dropdown, { detail: { keys: 'xxxxx' } });

    await waitFor(() => expect(dropdown.popup.visible).toEqual(false));
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('ignores type ahead when readonly', async () => {
    dropdown.readonly = true;
    dropdown.triggerEvent('keydownend', dropdown, { detail: { keys: 'option thr' } });

    dropdown.disabled = true;
    dropdown.triggerEvent('keydownend', dropdown, { detail: { keys: 'option thr' } });

    await waitFor(() => expect(dropdown.popup.visible).toEqual(false));
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('supports clicking trigger to open', async () => {
    expect(dropdown.popup.visible).toEqual(false);
    await waitFor(() => expect(dropdown.trigger).toBeTruthy());

    dropdown.trigger.click();
    dropdown.triggerEvent('mouseup', dropdown.trigger);
    expect(dropdown.popup.visible).toEqual(true);
  });

  it('supports clicking input to open', async () => {
    await waitFor(() => expect(dropdown.container).toBeTruthy());

    dropdown.container.click();
    dropdown.triggerEvent('mouseup', dropdown.container);
    expect(dropdown.popup.visible).toEqual(true);
  });

  it('supports clicking to select', async () => {
    expect(dropdown.value).toEqual('opt2');

    await waitFor(() => expect(dropdown.trigger).toBeTruthy());
    dropdown.trigger.click();
    dropdown.triggerEvent('mouseup', dropdown.trigger);

    await waitFor(() => expect(dropdown.popup.visible).toEqual(true));
    dropdown.querySelectorAll('ids-list-box-option')[4].click();
    expect(dropdown.value).toEqual('opt5');
  });

  it('supports clicking to select on the icon', () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-5" label="Dropdown with Icons" value="opt2">
    <ids-list-box>
      <ids-list-box-option value="opt1" id="opt1">
        <ids-icon icon="user-profile"></ids-icon>
        <span>Option One</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt2" id="opt2">
        <ids-icon icon="project"></ids-icon>
        <span>Option Two</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt3" id="opt3">
        <ids-icon icon="purchasing"></ids-icon>
        <span>Option Three</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt4" id="opt4">
        <ids-icon icon="quality"></ids-icon>
        <span>Option Four</span></ids-list-box-option>
      <ids-list-box-option value="opt5" id="opt5">
        <ids-icon icon="rocket"></ids-icon>
        <span>Option Five</span>
      </ids-list-box-option>
      <ids-list-box-option value="opt6" id="opt6">
        <ids-icon icon="roles"></ids-icon>
        <span>Option Six</span>
      </ids-list-box-option>
    </ids-list-box>
    </ids-dropdown>`);
    expect(dropdown.value).toEqual('opt2');

    const icons = dropdown.querySelectorAll('ids-list-box-option ids-icon');
    icons[5].click();
    expect(dropdown.value).toEqual('opt6');
  });

  it('can changing language from the container', async () => {
    await container.setLanguage('de');
    await processAnimFrame();
    expect(dropdown.getAttribute('aria-description')).toEqual('Drücken Sie zum Auswählen die Nach-unten-Taste');
  });

  it('opens on arrow down', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(true);
  });

  it('ignores arrow down on open', () => {
    dropdown.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(true);
  });

  it('opens on arrow up', () => {
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(true);
  });

  it('selects on arrow up and alt key', () => {
    dropdown.open();
    expect(dropdown.value).toEqual('opt2');
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);

    event = new KeyboardEvent('keydown', { key: 'ArrowUp', altKey: true });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');
  });

  it('closes on escape without changing', () => {
    dropdown.open();
    expect(dropdown.value).toEqual('opt2');
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);

    event = new KeyboardEvent('keydown', { key: 'Escape' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt2');
  });

  it('can not arrow up past top', () => {
    dropdown.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);

    expect(dropdown.querySelector('ids-list-box-option.is-selected').textContent).toEqual('Option Six');
  });

  it('can not arrow up to the bottom', () => {
    dropdown.open();
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);
    dropdown.dispatchEvent(event);

    expect(dropdown.querySelector('ids-list-box-option.is-selected').textContent).toEqual('Option One');
  });

  it('can open on enter or space', () => {
    expect(dropdown.popup.visible).toEqual(false);
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    dropdown.dispatchEvent(event);
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.dispatchEvent(event);
    expect(dropdown.popup.visible).toEqual(false);
  });

  it('selects on enter when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Enter' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');
  });

  it('selects on space when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: ' ' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');
  });

  it('selects on tab when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab' });
    dropdown.dispatchEvent(event);
    dropdown.querySelector('ids-list-box-option.is-selected').dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');

    dropdown.open();
    event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    dropdown.dispatchEvent(event);
    dropdown.querySelector('ids-list-box-option.is-selected').dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt4');
  });

  it('tab works correcty', async () => {
    dropdown.container.focus();
    expect(document.activeElement.id).toEqual('dropdown-1');
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    dropdown.dispatchEvent(event);

    // Not working right, not sure why?
    expect(document.activeElement.id).toEqual('dropdown-1');
  });
});
