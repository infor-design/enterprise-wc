/**
 * @jest-environment jsdom
 */
import createFromTemplate from '../helpers/create-from-template';
import '../helpers/resize-observer-mock';
import '../../src/components/ids-search-field/ids-search-field';

const HTMLSnippets = {
  VANILLA_SEARCH_FIELD: (
    `<ids-search-field></ids-search-field>`
  ),
  DISABLED_SEARCH_FIELD: (
    `<ids-search-field disabled label="Pokemon" value="Snorlax"></ids-search-field>`
  ),
  READONLY_SEARCH_FIELD: (
    `<ids-search-field readonly label="Pokemon" value="Lapras"></ids-search-field>`
  ),
  CATEGORY_FULL: (
    `<ids-search-field label="Categories" category="File Types" value="Search term" action="Go" multiple></ids-search-field>`
  ),
  CATEGORY: (
    `<ids-search-field label="Categories" value=""></ids-search-field>`
  ),
  CATEGORY_SHORT: (
    `<ids-search-field label="Categories Short"></ids-search-field>`
  ),
  CATEGORY_MULTIPLE: (
    `<ids-search-field label="Categories (multiple)" multiple></ids-search-field>`
  ),
  CATEGORY_BUTTON: (
    `<ids-search-field label="Categories + Button" value="" action="Go"></ids-search-field>`
  ),
  CATEGORY_SEARCH_TERM: (
    `<ids-search-field label="Categories + Button" value="keyword here" action="Go"></ids-search-field>`
  ),
};

const CATEGORIES = ['Documents', 'Images', 'Audio', 'Video'];

describe('IdsSearchField Component', () => {
  let s: any;

  const createEvent = (type: any, attributes = {}) => {
    const event = new Event(type);
    Object.assign(event, attributes);
    return event;
  };

  const createKeyboardEvent = (keyName: any) => {
    const event = new KeyboardEvent('keydown', { key: keyName });
    return event;
  };

  beforeEach(async () => {
    s = await createFromTemplate(s, HTMLSnippets.VANILLA_SEARCH_FIELD);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    s?.remove();
  });

  test('sets the label correctly', () => {
    expect(s.label).toBe('Search');

    const customLabels = ['Grocery Items', 'Dog Breeds', 'Book Titles'];

    customLabels.forEach((x) => {
      s.label = x;
      expect(s.label).toBe(x);
    });
  });

  test('sets the value correctly', () => {
    expect(s.value).toBe('');

    const customValues = ['Apple', 'Labradoodle', 'Harry Potter'];

    customValues.forEach((x) => {
      s.value = x;
      expect(s.value).toBe(x);
    });
  });

  test('sets the placeholder correctly', () => {
    expect(s.placeholder).toBe('Type to search');

    const customPlaceholders = ['Enter a vegetable name', 'Try typing "poodle"', 'Looking for a book?'];

    customPlaceholders.forEach((x) => {
      s.placeholder = x;
      expect(s.placeholder).toBe(x);
    });
  });

  test('inits readonly and disabled state correctly', async () => {
    s = await createFromTemplate(s, HTMLSnippets.DISABLED_SEARCH_FIELD);
    s = await createFromTemplate(s, HTMLSnippets.READONLY_SEARCH_FIELD);
  });

  test('sets the disabled state correctly', () => {
    expect(s.disabled).toBeFalsy();

    s.disabled = '';
    expect(s.disabled).toBeTruthy();

    s.disabled = 'false';
    expect(s.disabled).toBeFalsy();
  });

  test('sets the readonly correctly', () => {
    expect(s.readonly).toBeFalsy();

    s.readonly = '';
    expect(s.readonly).toBeTruthy();

    s.readonly = 'false';
    expect(s.readonly).toBeFalsy();
  });

  test('listens for input events', () => {
    s.input.dispatchEvent(
      createEvent('input')
    );
  });

  test('listens for keydown events', () => {
    s.input.dispatchEvent(
      createKeyboardEvent('Enter')
    );

    s.input.dispatchEvent(
      createKeyboardEvent('Space')
    );
  });

  test('fires a user-defined `onSearch` method when the value changes', async () => {
    const data = ['one', 'two', 'three', 'four', 'five'];
    s.onSearch = (val: any) => data.filter((item) => item.includes(val));

    let results = await s.search('five');
    expect(results.length).toBe(1);

    results = await s.search('f');
    expect(results.length).toBe(2);
  });

  test('readonly/disabled should be clearable with clearable-forced setting', async () => {
    s = await createFromTemplate(s, HTMLSnippets.DISABLED_SEARCH_FIELD);
    s.clearable = true;
    expect(s.container.querySelector('.btn-clear')).toBeNull();

    s.clearable = false;
    s.clearableForced = true;
    expect(s.container.querySelector('.btn-clear')).not.toBeNull();

    s = await createFromTemplate(s, HTMLSnippets.READONLY_SEARCH_FIELD);
    s.clearable = true;
    expect(s.container.querySelector('.btn-clear')).toBeNull();
    s.clearableForced = true;
    expect(s.container.querySelector('.btn-clear')).not.toBeNull();
  });

  it.skip('renders categories full', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_FULL);

    // s.categories = ['Documents', 'Images', 'Audio', 'Video'];
    s.categories = CATEGORIES;
    expect(s.container.outerHTML).toMatchSnapshot();
  });

  test('shows action button when action prop set', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_BUTTON);
    s.categories = CATEGORIES;
    expect(s.container.querySelector('#category-action-button')).not.toBeNull();
  });

  test('shows full category dropdown when categories set', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_FULL);
    s.categories = CATEGORIES;

    expect(s.container.querySelector('ids-popup-menu')?.textContent).toMatch(CATEGORIES.join(''));
    expect(s.container.querySelector('ids-menu-button').textContent).toMatch('File Types');
  });

  test('shows short category dropdown when categories set', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_SHORT);
    s.categories = CATEGORIES;

    expect(s.container.querySelector('ids-popup-menu')?.textContent).toMatch(CATEGORIES.join(''));
    expect(s.container.querySelector('ids-menu-button').textContent).toMatch('Select Search Category');
  });

  test('triggers "change" event when input-value changed', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_SEARCH_TERM);
    s.categories = CATEGORIES;

    const changeEventListener = jest.fn((evt) => {
      expect(evt.detail.value).toBe('new keyword here');
    });

    s.addEventListener('change', changeEventListener);

    s.value = 'new keyword here';
    expect(changeEventListener).toBeCalledTimes(1);
  });

  test('triggers "search" event when action-button clicked', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_SEARCH_TERM);
    s.categories = CATEGORIES;

    const searchEventListener = jest.fn((evt) => {
      expect(evt.detail.categories).toBe(CATEGORIES);
      expect(evt.detail.categoriesSelected).toMatchObject([]);
      expect(evt.detail.value).toBe('keyword here');
    });

    s.addEventListener('search', searchEventListener);
    await s.container.querySelector('#category-action-button').click();
    expect(searchEventListener).toBeCalledTimes(1);
  });

  test('triggers "search" event when Enter key pressed', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_SEARCH_TERM);
    s.categories = CATEGORIES;

    const searchEventListener = jest.fn((evt) => {
      expect(evt.detail.categories).toBe(CATEGORIES);
      expect(evt.detail.categoriesSelected).toMatchObject([]);
      expect(evt.detail.value).toBe('keyword here');
    });

    s.addEventListener('search', searchEventListener);

    s.input.dispatchEvent(
      createKeyboardEvent('Enter')
    );

    expect(searchEventListener).toBeCalledTimes(1);
  });

  test('triggers "selected/deselcted" event when category-menu clicked', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_FULL);
    s.categories = CATEGORIES;

    const selectedEventListener = jest.fn((evt) => {
      expect(evt.detail.categories).toBe(CATEGORIES);
      expect(evt.detail.categoriesSelected).toMatchObject(['Images']);
      expect(evt.detail.value).toBe('Search term');
    });

    const deselectedEventListener = jest.fn((evt) => {
      expect(evt.detail.categories).toBe(CATEGORIES);
      expect(evt.detail.categoriesSelected).toMatchObject([]);
      expect(evt.detail.value).toBe('Search term');
    });

    s.addEventListener('selected', selectedEventListener);
    s.addEventListener('deselected', deselectedEventListener);

    await s.container.querySelector('ids-popup-menu').items[1].click();
    expect(selectedEventListener).toBeCalledTimes(1);

    await s.container.querySelector('ids-popup-menu').items[1].click();
    expect(deselectedEventListener).toBeCalledTimes(1);
  });

  test('updates menu-button text to say # selected', async () => {
    s = await createFromTemplate(s, HTMLSnippets.CATEGORY_FULL);
    s.categories = CATEGORIES;

    await s.container.querySelector('ids-popup-menu').items[2].click();
    expect(s.container.querySelector('ids-menu-button').textContent).toMatch('Audio');

    await s.container.querySelector('ids-popup-menu').items[3].click();
    expect(s.container.querySelector('ids-menu-button').textContent).toMatch('2 Selected');

    await s.container.querySelector('ids-popup-menu').items[2].click();
    expect(s.container.querySelector('ids-menu-button').textContent).toMatch('Video');
  });
});
