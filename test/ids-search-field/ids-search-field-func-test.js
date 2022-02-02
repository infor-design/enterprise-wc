/**
 * @jest-environment jsdom
 */

import IdsSearchField from '../../src/components/ids-search-field/ids-search-field';

const HTMLSnippets = {
  VANILLA_SEARCH_FIELD: (
    `<ids-search-field></ids-search-field>`
  ),
  DISABLED_SEARCH_FIELD: (
    `<ids-search-field disabled label="Pokemon" value="Snorlax"></ids-search-field>`
  ),
  READONLY_SEARCH_FIELD: (
    `<ids-search-field readonly label="Pokemon" value="Lapras"></ids-search-field>`
  )
};

describe('IdsSearchField Component', () => {
  let s;

  const createEvent = (type, attributes = {}) => {
    const event = new Event(type);
    Object.assign(event, attributes);
    return event;
  };

  const createKeyboardEvent = (keyName) => {
    const event = new KeyboardEvent('keydown', { key: keyName });
    return event;
  };

  const createElemViaTemplate = async (innerHTML) => {
    s?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    s = template.content.childNodes[0];

    document.body.appendChild(s);

    return s;
  };

  beforeEach(async () => {
    s = await createElemViaTemplate(HTMLSnippets.VANILLA_SEARCH_FIELD);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    s?.remove();
  });

  it('renders with no errors', async () => {
    s = await createElemViaTemplate(HTMLSnippets.VANILLA_SEARCH_FIELD);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-search-field').length).toEqual(1);

    s.remove();

    s = await createElemViaTemplate(HTMLSnippets.VANILLA_SEARCH_FIELD);
    document.body.appendChild(s);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    const elem = await createElemViaTemplate(HTMLSnippets.VANILLA_SEARCH_FIELD);
    elem.label = 'Test Search Field Label';
    elem.value = 'Eevee';
    elem.placeholder = 'Please type a Pokemon';
    document.body.appendChild(elem);
    elem.template();
    expect(elem.outerHTML).toMatchSnapshot();
  });

  it('sets the label correctly', () => {
    expect(s.label).toBe(s.DEFAULT_LABEL);

    const customLabels = ['Grocery Items', 'Dog Breeds', 'Book Titles'];

    customLabels.forEach((x) => {
      s.label = x;
      expect(s.label).toBe(x);
    });
  });

  it('sets the value correctly', () => {
    expect(s.value).toBe('');

    const customValues = ['Apple', 'Labradoodle', 'Harry Potter'];

    customValues.forEach((x) => {
      s.value = x;
      expect(s.value).toBe(x);
    });
  });

  it('sets the placeholder correctly', () => {
    expect(s.placeholder).toBe(s.DEFAULT_PLACEHOLDER);

    const customPlaceholders = ['Enter a vegetable name', 'Try typing "poodle"', 'Looking for a book?'];

    customPlaceholders.forEach((x) => {
      s.placeholder = x;
      expect(s.placeholder).toBe(x);
    });
  });

  it('inits readonly and disabled state correctly', async () => {
    s = await createElemViaTemplate(HTMLSnippets.DISABLED_SEARCH_FIELD);
    s = await createElemViaTemplate(HTMLSnippets.READONLY_SEARCH_FIELD);
  });

  it('sets the disabled state correctly', () => {
    expect(s.disabled).toBeFalsy();

    s.disabled = '';
    expect(s.disabled).toBeTruthy();

    s.disabled = 'false';
    expect(s.disabled).toBeFalsy();
  });

  it('sets the readonly correctly', () => {
    expect(s.readonly).toBeFalsy();

    s.readonly = '';
    expect(s.readonly).toBeTruthy();

    s.readonly = 'false';
    expect(s.readonly).toBeFalsy();
  });

  it('listens for input events', () => {
    s.input.dispatchEvent(
      createEvent('input')
    );
  });

  it('listens for keydown events', () => {
    s.input.dispatchEvent(
      createKeyboardEvent('Enter')
    );

    s.input.dispatchEvent(
      createKeyboardEvent('Space')
    );
  });

  it('fires a user-defined `onSearch` method when the value changes', async () => {
    const data = ['one', 'two', 'three', 'four', 'five'];
    s.onSearch = (val) => data.filter((item) => item.includes(val));

    let results = await s.search('five');
    expect(results.length).toBe(1);

    results = await s.search('f');
    expect(results.length).toBe(2);
  });
});
