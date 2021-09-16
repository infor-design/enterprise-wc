/**
 * @jest-environment jsdom
 */
import IdsDropdown from '../../src/components/ids-dropdown';
import waitFor from '../helpers/wait-for';
import IdsListBox from '../../src/components/ids-list-box';
import IdsListBoxOption from '../../src/components/ids-list-box/ids-list-box-option';
import IdsInput from '../../src/components/ids-input';
import states from '../../demos/data/states.json';

describe('IdsDropdown Component', () => {
  let dropdown;

  const createFromTemplate = (innerHTML) => {
    dropdown?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    dropdown = template.content.childNodes[0];
    document.body.appendChild(dropdown);
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

    dropdown.readonly = true;
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.getAttribute('readonly')).toBeTruthy();

    dropdown.input = null; // Sometimes happens in a start up state
    dropdown.readonly = false;
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

    dropdown.disabled = true;
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.getAttribute('disabled')).toBeTruthy();

    dropdown.input = null; // Sometimes happens in a start up state
    dropdown.disabled = false;
    expect(dropdown.disabled).toEqual(false);
    expect(dropdown.getAttribute('disabled')).toBeFalsy();

    dropdown.inputRoot = null; // Sometimes happens in a start up state
    dropdown.disabled = true;
    expect(dropdown.disabled).toEqual(true);
    expect(dropdown.getAttribute('disabled')).toBeTruthy();
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
    expect(dropdown.inputRoot.disabled).toEqual(true);
  });

  it('handles setting readonly', () => {
    dropdown.readonly = true;
    expect(dropdown.getAttribute('readonly')).toEqual('true');
    expect(dropdown.readonly).toEqual(true);
    expect(dropdown.inputRoot.disabled).toEqual(false);
  });

  it('can change the label', () => {
    dropdown.label = 'Changed Label';
    expect(dropdown.shadowRoot.querySelector('ids-input').label).toEqual('Changed Label');
  });

  it('should show dirty indicator on change', () => {
    expect(dropdown.dirty).toEqual({ original: 'Option Two' });
    dropdown.dirtyTracker = true;
    dropdown.value = 'opt3';
    expect(dropdown.dirty).toEqual({ original: 'Option Two' });
    expect(dropdown.inputRoot.shadowRoot.querySelector('.icon-dirty')).toBeTruthy();
  });

  it('should be able to set value', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.inputRoot.value).toEqual('Option Three');
  });

  it('should be able to set value with selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);

    dropdown.selectedIndex = 2;
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.inputRoot.value).toEqual('Option Three');

    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(2);
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.inputRoot.value).toEqual('Option Three');
  });

  it('should ignore null / bad selectedIndex', () => {
    expect(dropdown.selectedIndex).toEqual(1);
    dropdown.selectedIndex = 'x'; // ignored
    expect(dropdown.selectedIndex).toEqual(1);
    expect(dropdown.value).toEqual('opt2');
    expect(dropdown.inputRoot.value).toEqual('Option Two');
  });

  it('should ignore null / bad value', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.inputRoot.value).toEqual('Option Three');

    dropdown.value = null;
    expect(dropdown.inputRoot.value).toEqual('Option Three');

    dropdown.value = 'optx';
    expect(dropdown.inputRoot.value).toEqual('Option Three');
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

  it('supports clicking to open', () => {
    expect(dropdown.popup.visible).toEqual(false);
    //dropdown.fieldContainer.click();
    console.log(dropdown.container?.querySelector('ids-input')?.shadowRoot.querySelector('.field-container'));
    expect(dropdown.popup.visible).toEqual(true);
    dropdown.close();
  });
});
