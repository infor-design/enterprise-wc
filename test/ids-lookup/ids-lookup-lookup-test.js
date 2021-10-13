/**
 * @jest-environment jsdom
 */
import IdsLookup from '../../src/components/ids-lookup';
import createFromTemplate from '../helpers/create-from-template';

describe('IdsLookup Component', () => {
  let lookup;

  beforeEach(async () => {
    lookup = await createFromTemplate(lookup, `<ids-lookup id="lookup-1" label="Normal Lookup"></ids-lookup>`);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders empty dropdown with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    lookup.remove();
    const elem = new IdsLookup();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-lookup').length).toEqual(0);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(lookup.outerHTML).toMatchSnapshot();
    expect(lookup.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('renders with disabled', () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="lookup-1" disabled="true" label="Test"></ids-lookup>`);
    expect(lookup.disabled).toBeTruthy();
    expect(lookup.readonly).toBeFalsy();
  });

  it('renders with readonly', () => {
    lookup = createFromTemplate(lookup, `<ids-lookup id="dropdown-1" readonly="true" label="Test"></ids-lookup>`);
    expect(lookup.readonly).toBeTruthy();
    expect(lookup.disabled).toBeFalsy();
  });

  it('should be able to set label', () => {
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual('Normal Lookup');
    expect(lookup.label).toEqual('Normal Lookup');
    lookup.label = 'Test New Label';
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual('Test New Label');
    expect(lookup.label).toEqual('Test New Label');
    lookup.label = '';
    expect(lookup.shadowRoot.querySelector('ids-input').getAttribute('label')).toEqual(null);
    expect(lookup.label).toEqual('');
  });

  it('should be able to set value', () => {
    lookup.value = '218901';
    expect(lookup.value).toEqual('218901');
    expect(lookup.input.value).toEqual('218901');
  });

  it('should be able to set readonly with the property', () => {
    lookup.readonly = true;
    expect(lookup.triggerField.readonly).toEqual(true);
    expect(lookup.getAttribute('readonly')).toEqual('true');

    lookup.readonly = false;
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.getAttribute('readonly')).toEqual(null);

    lookup.triggerField = null;
    expect(lookup.readonly).toEqual(false);
  });

  it('should be able to set readonly with the attribute', () => {
    lookup.setAttribute('readonly', 'true');
    expect(lookup.triggerField.readonly).toEqual(true);
    expect(lookup.readonly).toEqual(true);

    lookup.setAttribute('readonly', 'false');
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.readonly).toEqual(false);

    lookup.setAttribute('readonly', 'true');
    lookup.removeAttribute('readonly');
    expect(lookup.triggerField.readonly).toEqual(false);
    expect(lookup.readonly).toEqual(false);
  });

  it('should be able to set disabled with the property', () => {
    lookup.disabled = true;
    expect(lookup.triggerField.disabled).toEqual(true);
    expect(lookup.getAttribute('disabled')).toEqual('true');

    lookup.disabled = false;
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.getAttribute('disabled')).toEqual(null);

    lookup.triggerField = null;
    expect(lookup.disabled).toEqual(false);
  });

  it('should be able to set disabled with the attribute', () => {
    lookup.setAttribute('disabled', 'true');
    expect(lookup.triggerField.disabled).toEqual(true);
    expect(lookup.disabled).toEqual(true);

    lookup.setAttribute('disabled', 'false');
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.disabled).toEqual(false);

    lookup.setAttribute('disabled', 'true');
    lookup.removeAttribute('disabled');
    expect(lookup.triggerField.disabled).toEqual(false);
    expect(lookup.disabled).toEqual(false);
  });

  it('should be able to set tabbable with the property', () => {
    lookup.tabbable = true;
    expect(lookup.triggerField.tabbable).toEqual(true);
    expect(lookup.getAttribute('tabbable')).toEqual('true');

    lookup.tabbable = false;
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.getAttribute('tabbable')).toEqual('false');

    lookup.triggerField = null;
    lookup.tabbable = false;
    expect(lookup.tabbable).toEqual(false);
  });

  it('should be able to set tabbable with the attribute', () => {
    lookup.setAttribute('tabbable', 'true');
    expect(lookup.triggerField.tabbable).toEqual(true);
    expect(lookup.tabbable).toEqual(true);

    lookup.setAttribute('tabbable', 'false');
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.tabbable).toEqual(false);

    lookup.setAttribute('tabbable', 'true');
    lookup.removeAttribute('tabbable');
    expect(lookup.triggerField.tabbable).toEqual(false);
    expect(lookup.tabbable).toEqual(false);
  });

  it('should fire change on setting the value', () => {
    lookup.addEventListener('change', (e) => {
      expect(e.detail.value).toEqual('218902');
    });
    lookup.value = '218902';
    expect(lookup.input.value).toEqual('218902');
  });
});
