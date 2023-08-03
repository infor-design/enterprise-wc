/**
 * @jest-environment jsdom
 */
import '../helpers/resize-observer-mock';
import waitForTimeout from '../helpers/wait-for-timeout';
import wait from '../helpers/wait';
import processAnimFrame from '../helpers/process-anim-frame';

import IdsDropdown from '../../src/components/ids-dropdown/ids-dropdown';
import '../../src/components/ids-list-box/ids-list-box';
import '../../src/components/ids-list-box/ids-list-box-option';
import '../../src/components/ids-trigger-field/ids-trigger-field';
import states from '../../src/assets/data/states.json';
import IdsContainer from '../../src/components/ids-container/ids-container';
import { messages as deMessages } from '../../src/components/ids-locale/data/de-messages';
import IdsLocaleData from '../../src/components/ids-locale/ids-locale-data';

describe('IdsDropdown Component', () => {
  let dropdown: any;
  let container: any;

  const createFromTemplate = (innerHTML: any) => {
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
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsDropdown();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-dropdown').length).toEqual(1);
    elem.remove();
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
    dropdown.container.readonly = false;
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

  it('can set allow blank', () => {
    dropdown.allowBlank = true;
    dropdown.value = 'blank';
    expect(dropdown.allowBlank).toBeTruthy();
    expect(dropdown.value).toEqual('blank');

    dropdown.allowBlank = false;
    expect(dropdown.allowBlank).toBeFalsy();
    expect(dropdown.value).toBeNull();
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
    await waitForTimeout(() => expect(dropdown.shadowRoot.querySelector('ids-trigger-field')).toBeTruthy());

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

    await waitForTimeout(() => expect(dropdown.getAttribute('tooltip')).toBeTruthy());
    expect(dropdown.tooltip).toEqual('Additional Info on Option Two');
  });

  it('handles setting disabled', () => {
    dropdown.disabled = true;
    expect(dropdown.getAttribute('disabled')).toEqual('true');
    expect(dropdown.getAttribute('readonly')).toBeFalsy();
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.input.disabled).toEqual(true);
  });

  it('handles setting readonly', () => {
    dropdown.readonly = true;
    expect(dropdown.getAttribute('readonly')).toEqual('true');
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.input.disabled).toEqual(false);
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
    expect(dropdown.input.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
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
    expect(dropdown.input.value).toEqual('Option Three');
  });

  it('should be able to set value with selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);

    dropdown.selectedIndex = 2;
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.input.value).toEqual('Option Three');

    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.input.value).toEqual('Option Three');
  });

  it('should ignore null / bad selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);
    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(1);
    expect(dropdown.value).toEqual('opt2');
    expect(dropdown.input.value).toEqual('Option Two');
  });

  it('should ignore null / bad value', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.input.value).toEqual('Option Three');

    dropdown.value = null;
    expect(dropdown.input.value).toEqual('Option Three');

    dropdown.value = 'optx';
    expect(dropdown.input.value).toEqual('Option Three');
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
  });

  it('can click outside an open list to close it', (done) => {
    const clickEvent = new MouseEvent('click', { bubbles: true });

    dropdown.dropdownList.onOutsideClick = jest.fn();
    dropdown.open();

    setTimeout(() => {
      // Click outside the Modal into the overlay area
      document.body.dispatchEvent(clickEvent);

      setTimeout(() => {
        expect(dropdown.dropdownList.onOutsideClick).toHaveBeenCalled();
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

  it.skip('supports type ahead to filter and select an option', async () => {
    expect(dropdown.typeahead).toBeFalsy();
    // Turn on typeahead
    dropdown.typeahead = true;
    expect(dropdown.typeahead).toBeTruthy();
    dropdown.open();
    expect(dropdown.popup.visible).toBeTruthy();
    expect(dropdown.value).toEqual('opt2');
    // Typing v letter (only Option Five to match)
    dropdown.input.value = 'v';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }));
    // Keydownend delay
    await wait(600);
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(1);
    expect(dropdown.querySelector('ids-list-box-option')?.getAttribute('value')).toEqual('opt5');
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('opt5');
    // Populate initial options
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(6);
    // Turn off typeahead
    dropdown.typeahead = false;
    expect(dropdown.typeahead).toBeFalsy();
  });

  it('supports type ahead to show No Results option when nothing found', async () => {
    // Turn on typeahead
    dropdown.typeahead = true;
    expect(dropdown.typeahead).toBeTruthy();
    dropdown.open();
    // Typing y letter (no matches)
    dropdown.input.value = 'y';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'y' }));
    // Keydownend delay
    await wait(600);
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(1);
    expect(dropdown.querySelector('ids-list-box-option')?.textContent).toEqual('No results');
  });

  it('ignores type ahead when readonly', async () => {
    dropdown.readonly = true;
    // Turn on typeahead
    dropdown.typeahead = true;
    expect(dropdown.typeahead).toBeTruthy();
    dropdown.open();
    // Typing y letter (no matches)
    dropdown.input.value = 'y';
    dropdown.input.dispatchEvent(new KeyboardEvent('keydown', { key: 'y' }));
    // Keydownend delay
    await wait(600);
    // Has initial options
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(6);
  });

  it('supports type ahead when the dropdown is closed', async () => {
    dropdown.typeahead = true;

    // Typing v letter when closed (only Option Five to match)
    dropdown.input.value = 'v';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'v' }));

    // Keydownend delay
    await wait(600);
    expect(dropdown.querySelectorAll('ids-list-box-option').length).toEqual(1);
    expect(dropdown.querySelector('ids-list-box-option')?.getAttribute('value')).toEqual('opt5');
    expect(dropdown.popup.visible).toBeTruthy();

    document.body.dispatchEvent(new MouseEvent('click'));
    expect(dropdown.popup.visible).toBeFalsy();
  });

  it('should accept Space key and stay opened when typing with typeahead', async () => {
    dropdown.typeahead = true;
    dropdown.open();
    // Typing v letter when closed (only Option Five to match)
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    // Keydownend delay
    await wait(600);

    expect(dropdown.popup.visible).toBeTruthy();
  });

  it.skip('should clear value if clearable is set', () => {
    dropdown.clearable = true;
    expect(dropdown.clearable).toBeTruthy();

    // Backspace on the focused closed dropdown
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(dropdown.input.value).toEqual('');
    expect(dropdown.value).toEqual('');

    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('opt1');

    // With blank option
    dropdown.allowBlank = true;
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }));
    expect(dropdown.input.value).toEqual('');
    expect(dropdown.value).toEqual('blank');

    dropdown.clearable = false;
    expect(dropdown.clearable).toBeFalsy();
  });

  it('should handle custom text for blank option', () => {
    const clearText = '(Custom Clear Text)';
    dropdown.allowBlank = true;
    dropdown.clearableText = clearText;

    expect(dropdown.getAttribute('clearable-text')).toEqual(clearText);
    expect(dropdown.querySelector(`ids-list-box-option[value="blank"]`)?.textContent).toEqual(clearText);

    dropdown.clearableText = null;
    expect(dropdown.getAttribute('clearable-text')).toBeNull();
  });

  it('supports clicking trigger to open', async () => {
    await waitForTimeout(() => expect(dropdown.trigger).toBeTruthy());

    dropdown.trigger.click();
    expect(dropdown.popup.visible).toEqual(true);
  });

  it('supports clicking input to open', async () => {
    await waitForTimeout(() => expect(dropdown.container).toBeTruthy());
    dropdown.input.input.click();
    await waitForTimeout(() => expect(dropdown.popup.visible).toBeTruthy());
    expect(dropdown.popup.visible).toBeTruthy();
  });

  it('should not open by clicking on label', async () => {
    await waitForTimeout(() => expect(dropdown.labelEl).toBeTruthy());
    expect(dropdown.labelEl).toBeTruthy();
    dropdown.labelEl.click();
    await waitForTimeout(() => expect(dropdown.popup.visible).toBeFalsy());
    expect(dropdown.popup.visible).toBeFalsy();
    dropdown.input.input.click();
    await waitForTimeout(() => expect(dropdown.popup.visible).toBeTruthy());
    expect(dropdown.popup.visible).toBeTruthy();
  });

  it('should not set icon if setting has-icon as false', async () => {
    expect(dropdown.value).toEqual('opt2');
    dropdown.trigger.click();

    await wait(80);
    dropdown.hasIcons = false;
    dropdown.container.insertAdjacentHTML('beforeend', '<ids-icon icon="user-profile" slot="trigger-start"></ids-icon>');
    dropdown.querySelectorAll('ids-list-box-option')[4].click();

    await wait(80);
    expect(dropdown.value).toEqual('opt5');
  });

  it('supports clicking to select', async () => {
    expect(dropdown.value).toEqual('opt2');
    dropdown.trigger.click();

    await wait(80);
    dropdown.querySelectorAll('ids-list-box-option')[4].click();

    await wait(80);
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
    IdsLocaleData.loadedLanguages.set('de', deMessages);
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

  it.skip('selects on arrow up and alt key', () => {
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

  it.skip('can not arrow up past top', () => {
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

  it.skip('can not arrow up to the bottom', () => {
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

  it.skip('can open on enter or space', () => {
    expect(dropdown.popup.visible).toEqual(false);
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    dropdown.dispatchEvent(event);
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.dispatchEvent(event);
    expect(dropdown.popup.visible).toEqual(false);
  });

  it.skip('selects on enter when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Enter' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');
  });

  it.skip('selects on space when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: ' ' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');
  });

  it.skip('selects on tab when open', () => {
    dropdown.open();
    let event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab' });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt3');

    dropdown.open();
    event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    dropdown.dispatchEvent(event);
    event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    dropdown.dispatchEvent(event);

    expect(dropdown.popup.visible).toEqual(false);
    expect(dropdown.value).toEqual('opt4');
  });

  it('tab works correcty', async () => {
    dropdown.input.focus();
    expect((document.activeElement as any).id).toEqual('dropdown-1');
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    dropdown.dispatchEvent(event);

    // Not working right, not sure why?
    expect((document.activeElement as any).id).toEqual('dropdown-1');
  });

  it('should render field height', () => {
    const heights = ['xs', 'sm', 'md', 'lg'];
    const defaultHeight = 'md';
    const className = (h: any) => `field-height-${h}`;
    const checkHeight = (height: any) => {
      dropdown.fieldHeight = height;

      expect(dropdown.input.getAttribute('field-height')).toEqual(height);
      expect(dropdown.container.classList).toContain(className(height));
      heights.filter((h) => h !== height).forEach((h) => {
        expect(dropdown.container.classList).not.toContain(className(h));
      });
    };

    expect(dropdown.getAttribute('field-height')).toEqual(null);
    heights.filter((h) => h !== defaultHeight).forEach((h) => {
      expect(dropdown.container.classList).not.toContain(className(h));
    });

    expect(dropdown.container.classList).toContain(className(defaultHeight));
    heights.forEach((h) => checkHeight(h));
    dropdown.removeAttribute('field-height');
    dropdown.removeAttribute('compact');

    expect(dropdown.getAttribute('field-height')).toEqual(null);
    heights.filter((h) => h !== defaultHeight).forEach((h) => {
      expect(dropdown.container.classList).not.toContain(className(h));
    });
    dropdown.onFieldHeightChange();

    expect(dropdown.container.classList).toContain(className(defaultHeight));
  });

  it('should set compact height', () => {
    dropdown.compact = true;

    expect(dropdown.hasAttribute('compact')).toBeTruthy();
    expect(dropdown.container.classList.contains('compact')).toBeTruthy();
    dropdown.compact = false;

    expect(dropdown.hasAttribute('compact')).toBeFalsy();
    expect(dropdown.container.classList.contains('compact')).toBeFalsy();
  });

  it('should set size', () => {
    const sizes = ['xs', 'sm', 'mm', 'md', 'lg', 'full'];
    const defaultSize = 'md';
    const checkSize = (size: any) => {
      dropdown.size = size;

      expect(dropdown.getAttribute('size')).toEqual(size);
      expect(dropdown.input.getAttribute('size')).toEqual(size);
      expect(dropdown.dropdownList.listBox.getAttribute('size')).toEqual(size);
    };

    expect(dropdown.getAttribute('size')).toEqual(null);
    expect(dropdown.input.getAttribute('size')).toEqual(defaultSize);
    sizes.forEach((s) => checkSize(s));
    dropdown.size = null;

    expect(dropdown.getAttribute('size')).toEqual(null);
    expect(dropdown.input.getAttribute('size')).toEqual(defaultSize);
    expect(dropdown.dropdownList.listBox.getAttribute('size')).toEqual(null);
  });

  it('should set no margins', () => {
    expect(dropdown.getAttribute('no-margins')).toEqual(null);
    expect(dropdown.noMargins).toEqual(false);
    expect(dropdown.input.getAttribute('no-margins')).toEqual(null);
    dropdown.noMargins = true;

    expect(dropdown.getAttribute('no-margins')).toEqual('');
    expect(dropdown.noMargins).toEqual(true);
    expect(dropdown.input.getAttribute('no-margins')).toEqual('');
    dropdown.noMargins = false;

    expect(dropdown.getAttribute('no-margins')).toEqual(null);
    expect(dropdown.noMargins).toEqual(false);
    expect(dropdown.input.getAttribute('no-margins')).toEqual(null);
  });

  it('should set values thru template', () => {
    expect(dropdown.colorVariant).toEqual(null);
    expect(dropdown.labelState).toEqual(null);
    expect(dropdown.compact).toEqual(false);
    expect(dropdown.noMargins).toEqual(false);
    dropdown.colorVariant = 'alternate-formatter';
    dropdown.labelState = 'collapsed';
    dropdown.compact = true;
    dropdown.noMargins = true;
    dropdown.template();

    expect(dropdown.colorVariant).toEqual('alternate-formatter');
    expect(dropdown.labelState).toEqual('collapsed');
    expect(dropdown.compact).toEqual(true);
    expect(dropdown.getAttribute('field-height')).toBeNull();
    expect(dropdown.hasAttribute('compact')).toBeTruthy();
    expect(dropdown.noMargins).toEqual(true);

    dropdown.compact = false;
    dropdown.fieldHeight = 'lg';
    dropdown.template();

    expect(dropdown.fieldHeight).toEqual('lg');
    expect(dropdown.hasAttribute('compact')).toBeFalsy();
    expect(dropdown.getAttribute('field-height')).toEqual('lg');
  });

  it('fixes itself with an empty container', () => {
    dropdown = createFromTemplate(
      `<ids-dropdown id="dropdown-1" label="Normal Dropdown">
       </ids-dropdown>`
    );
    expect(dropdown.container).toBeTruthy();
  });

  it.skip('should handle groups', async () => {
    dropdown.clearable = true;
    dropdown.value = '';
    dropdown.input.value = '';
    dropdown.beforeShow = async function beforeShow() {
      return [{
        label: 'Group 1',
        groupLabel: true
      }, {
        label: 'Option 1 u',
        value: 'gr1opt1'
      }, {
        label: 'Option 2',
        value: 'gr1opt2'
      }, {
        label: 'Group 2',
        groupLabel: true
      }, {
        label: 'Option 1 w',
        value: 'gr2opt1'
      }, {
        label: 'Option 2',
        value: 'gr2opt2'
      }];
    };
    await dropdown.open();

    // Renders groups
    expect(dropdown.querySelectorAll(`ids-list-box-option`)?.length).toEqual(6);
    expect(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length).toEqual(2);

    // Typeahead filtering
    dropdown.typeahead = true;
    dropdown.input.value = '2';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    // Keydownend delay
    await wait(700);

    expect(dropdown.querySelectorAll(`ids-list-box-option`)?.length).toEqual(4);
    expect(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length).toEqual(2);

    dropdown.value = '';
    dropdown.input.value = '';
    dropdown.input.value = 'w';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' }));
    // Keydownend delay
    await wait(700);

    expect(dropdown.querySelectorAll(`ids-list-box-option`)?.length).toEqual(2);
    expect(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length).toEqual(1);
    expect(dropdown.querySelector('ids-list-box-option[group-label]')?.textContent).toEqual('Group 2');

    dropdown.value = '';
    dropdown.input.value = 'u';
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'u' }));
    // Keydownend delay
    await wait(700);

    expect(dropdown.querySelectorAll(`ids-list-box-option`)?.length).toEqual(2);
    expect(dropdown.querySelectorAll(`ids-list-box-option[group-label]`)?.length).toEqual(1);
    expect(dropdown.querySelector('ids-list-box-option[group-label]')?.textContent).toEqual('Group 1');

    // Arrow Down should skip first group label
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('gr1opt1');

    // Arrow Up should not select group label
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('gr1opt1');

    // Arrow Up should skip group label
    dropdown.close();
    dropdown.value = 'gr2opt1';
    await dropdown.open();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('gr1opt2');

    // Arrow Down should skip group label
    dropdown.close();
    await dropdown.open();
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(dropdown.value).toEqual('gr2opt1');
  });

  it('should handle placeholder attribute', () => {
    dropdown.placeholder = 'select an item';
    expect(dropdown.input.placeholder).toEqual('select an item');

    dropdown.placeholder = null;
    expect(dropdown.placeholder).toEqual('');
    expect(dropdown.input.placeholder).toBeNull();
  });

  it('should select an option and update the value by keyboard input', async () => {
    dropdown = createFromTemplate(`<ids-dropdown id="dropdown-keyboard" label="Dropdown Keyboard">
      <ids-list-box>
        <ids-list-box-option value="opt1" id="opt1">A</ids-list-box-option>
        <ids-list-box-option value="opt2" id="opt2">B</ids-list-box-option>
        <ids-list-box-option value="opt3" id="opt3">C</ids-list-box-option>
        <ids-list-box-option value="opt4" id="opt4">1</ids-list-box-option>
        <ids-list-box-option value="opt5" id="opt5">2</ids-list-box-option>
        <ids-list-box-option value="opt6" id="opt6">3</ids-list-box-option>
      </ids-list-box>
    </ids-dropdown>`);

    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
    // Keydownend delay
    await wait(700);

    expect(dropdown.value).toEqual('opt3');

    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }));
    // Keydownend delay
    await wait(700);

    expect(dropdown.value).toEqual('opt4');
  });
});
