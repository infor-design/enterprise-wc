/**
 * @jest-environment jsdom
 */
import IdsDropdown from '../../src/components/ids-dropdown';
import IdsListBox from '../../src/components/ids-list-box';
import IdsListBoxOption from '../../src/components/ids-list-box/ids-list-box-option';
import IdsInput from '../../src/components/ids-input';

describe('IdsDropdown Component', () => {
  let dropdown;

  const createElemViaTemplate = (innerHTML) => {
    dropdown?.remove();
    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    dropdown = template.content.childNodes[0];
    document.body.appendChild(dropdown);
    return dropdown;
  };

  beforeEach(async () => {
    dropdown = createElemViaTemplate(
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

  it('should ignore null / bad option', () => {
    dropdown.value = 'opt3';
    expect(dropdown.value).toEqual('opt3');
    expect(dropdown.inputRoot.value).toEqual('Option Three');

    dropdown.value = null;
    expect(dropdown.inputRoot.value).toEqual('Option Three');

    dropdown.value = 'optx';
    expect(dropdown.inputRoot.value).toEqual('Option Three');
  });
});
