/**
 * @jest-environment jsdom
 */
import IdsListView from '../../src/components/ids-list-view/ids-list-view';
import datasetEvents from '../../src/assets/data/events.json';
import IdsContainer from '../../src/components/ids-container/ids-container';
import createFromTemplate from '../helpers/create-from-template';
import processAnimFrame from '../helpers/process-anim-frame';
import { deepClone } from '../../src/utils/ids-deep-clone-utils/ids-deep-clone-utils';
import '../../src/components/ids-search-field/ids-search-field';

const caseSensitiveData = [
  { id: '1', subject: 'CALIFORNIA' },
  { id: '2', subject: 'california' },
  { id: '3', subject: 'CaLiFoRnIa' },
  { id: '4', subject: 'PENNSYLVANIA' },
  { id: '5', subject: 'pennsylvania' },
  { id: '6', subject: 'PennSylvaNia' }
];

const phraseData = [
  { id: '1', subject: 'I eat chicken' },
  { id: '2', subject: 'You beef' },
  { id: '3', subject: 'He will eat fish' },
  { id: '4', subject: 'Some eat tofu' },
  { id: '5', subject: 'Eat all the things' }
];

const keywordData = [
  { id: '1', subject: 'grape apple kiwi' },
  { id: '2', subject: 'orange strawberry banana' },
  { id: '3', subject: 'blueberry apricot' },
  { id: '4', subject: 'pear banana raspberry' },
  { id: '5', subject: 'apple blackberry starfruit' },
  { id: '6', subject: 'kiwi orange apple' },
  { id: '7', subject: 'blackberry raspberry blueberry' }
];

describe('IdsListView Search', () => {
  let container: IdsContainer;
  let listView: IdsListView;

  beforeEach(async () => {
    container = new IdsContainer();
    listView = new IdsListView();
    listView.innerHTML = '<template><ids-text type="h2">${subject}</ids-text></template></ids-list-view>'; //eslint-disable-line
    listView.searchableTextCallback = (item: any) => item.subject;
    container.appendChild(listView);
    document.body.appendChild(container);
    listView.data = deepClone(datasetEvents);
    await processAnimFrame();
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    await processAnimFrame();
  });

  it('should set the searchable setting and renders search field', () => {
    expect(listView.getAttribute('searchable')).toEqual(null);
    expect(listView.searchable).toEqual(false);
    expect(listView.querySelector('ids-search-field[slot="search"]')).toBeFalsy();
    expect(listView.searchField).toBeFalsy();
    listView.searchable = true;
    expect(listView.getAttribute('searchable')).toEqual('');
    expect(listView.searchable).toEqual(true);
    expect(listView.querySelector('ids-search-field[slot="search"]')).toBeTruthy();
    expect(listView.searchField).toBeTruthy();
    listView.searchable = false;
    expect(listView.getAttribute('searchable')).toEqual(null);
    expect(listView.searchable).toEqual(false);
    expect(listView.querySelector('ids-search-field[slot="search"]')).toBeFalsy();
    expect(listView.searchField).toBeFalsy();
  });

  it('should renders search field thru slot', async () => {
    document.body.innerHTML = '';
    const html = '<ids-list-view><ids-search-field slot="search"></ids-search-field><template><ids-text type="h2">${subject}</ids-text></template></ids-list-view>'; //eslint-disable-line

    listView = await createFromTemplate(listView, html, container);
    await processAnimFrame();

    expect(listView.querySelector('ids-search-field[slot="search"]')).toBeTruthy();
  });

  it('should renders search field thru id', async () => {
    const id = 'lv-searchfield-1';
    const html = `<ids-search-field id="${id}"></ids-search-field>`;
    await createFromTemplate(null, html, container);
    await processAnimFrame();
    listView.searchFieldId = id;
    await processAnimFrame();

    expect(listView.closest('ids-container')?.querySelector(`#${listView.searchFieldId}`)).toBeTruthy();
    expect(listView.searchField).toBeTruthy();
    listView.searchFieldId = null;
    await processAnimFrame();

    expect(listView.closest('ids-container')?.querySelector(`#${listView.searchFieldId}`)).toBeFalsy();
    expect(listView.searchField).toBeFalsy();
  });

  it('should set the suppress highlight setting', () => {
    expect(listView.getAttribute('suppress-highlight')).toEqual(null);
    expect(listView.suppressHighlight).toEqual(false);
    listView.suppressHighlight = true;
    expect(listView.getAttribute('suppress-highlight')).toEqual('');
    expect(listView.suppressHighlight).toEqual(true);
    listView.suppressHighlight = false;
    expect(listView.getAttribute('suppress-highlight')).toEqual(null);
    expect(listView.suppressHighlight).toEqual(false);
  });

  it('should set the search term case sensitive setting', () => {
    expect(listView.getAttribute('search-term-case-sensitive')).toEqual(null);
    expect(listView.searchTermCaseSensitive).toEqual(false);
    listView.searchTermCaseSensitive = true;
    expect(listView.getAttribute('search-term-case-sensitive')).toEqual('');
    expect(listView.searchTermCaseSensitive).toEqual(true);
    listView.searchTermCaseSensitive = false;
    expect(listView.getAttribute('search-term-case-sensitive')).toEqual(null);
    expect(listView.searchTermCaseSensitive).toEqual(false);
  });

  it('should set the search term min size setting', () => {
    const defaultVal = 1;
    expect(listView.getAttribute('search-term-min-size')).toEqual(null);
    expect(listView.searchTermMinSize).toEqual(defaultVal);
    listView.searchTermMinSize = 3;
    expect(listView.getAttribute('search-term-min-size')).toEqual('3');
    expect(listView.searchTermMinSize).toEqual(3);
    listView.searchTermMinSize = 'test';
    expect(listView.getAttribute('search-term-min-size')).toEqual(null);
    expect(listView.searchTermMinSize).toEqual(defaultVal);
  });

  it('should set the search filter mode setting', () => {
    const modes = ['contains', 'keyword', 'phrase-starts-with', 'word-starts-with'];
    const defaultMode = 'contains';
    expect(listView.getAttribute('search-filter-mode')).toEqual(null);
    expect(listView.searchFilterMode).toEqual(defaultMode);

    modes.forEach((mode) => {
      listView.searchFilterMode = mode;
      expect(listView.getAttribute('search-filter-mode')).toEqual(mode);
      expect(listView.searchFilterMode).toEqual(mode);
    });

    listView.searchFilterMode = 'test';
    expect(listView.getAttribute('search-filter-mode')).toEqual(null);
    expect(listView.searchFilterMode).toEqual(defaultMode);
  });

  it('should show searched list', () => {
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    (listView.searchField as any).value = 'Discretionary';
    expect(listView.searchField?.value).toBe('Discretionary');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(2);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
  });

  it('should show searched list without searchable text callback', () => {
    const itemCountAll = 77;

    listView.searchableTextCallback = null;
    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    (listView.searchField as any).value = 'd';
    expect(listView.searchField?.value).toBe('d');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(72);

    (listView.searchField as any).value = 'disc';
    expect(listView.searchField?.value).toBe('disc');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(3);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
  });

  it('should suppress highlight trem searched list', () => {
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    expect(listView.suppressHighlight).toEqual(false);
    (listView.searchField as any).value = 'Disc';
    expect(listView.searchField?.value).toBe('Disc');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(2);
    expect(listView.shadowRoot?.querySelector('div[part="list-item"] ids-text .highlight')).toBeTruthy();

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.suppressHighlight = true;
    (listView.searchField as any).value = 'Disc';
    expect(listView.searchField?.value).toBe('Disc');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(2);
    expect(listView.shadowRoot?.querySelector('div[part="list-item"] ids-text .highlight')).toBeFalsy();
  });

  it('should show searched list by case sensitive', () => {
    listView.data = deepClone(caseSensitiveData);
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(6);

    listView.searchable = true;
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(6);

    (listView.searchField as any).value = 'calif';
    expect(listView.searchField?.value).toBe('calif');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(3);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(6);

    listView.searchTermCaseSensitive = true;
    (listView.searchField as any).value = 'calif';
    expect(listView.searchField?.value).toBe('calif');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(1);
  });

  it('should show searched list by matching the start of an entire phrase', () => {
    listView.data = deepClone(phraseData);
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(5);

    listView.searchable = true;
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(5);

    (listView.searchField as any).value = 'eat';
    expect(listView.searchField?.value).toBe('eat');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(4);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(5);

    listView.searchFilterMode = listView.searchFilterModes.PHRASE_STARTS_WITH;
    (listView.searchField as any).value = 'eat';
    expect(listView.searchField?.value).toBe('eat');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(1);
  });

  it('should show searched list by matching the start of words in any place in a string', () => {
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    (listView.searchField as any).value = 'day';
    expect(listView.searchField?.value).toBe('day');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(10);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchFilterMode = listView.searchFilterModes.WORD_STARTS_WITH;
    (listView.searchField as any).value = 'day';
    expect(listView.searchField?.value).toBe('day');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(9);
  });

  it('should show searched list by checking for multiple keywords in each result', () => {
    listView.data = deepClone(keywordData);
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(7);

    listView.searchable = true;
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(7);

    (listView.searchField as any).value = 'apple orange';
    expect(listView.searchField?.value).toBe('apple orange');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(0);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(7);

    listView.searchFilterMode = listView.searchFilterModes.KEYWORD;
    (listView.searchField as any).value = 'apple orange';
    expect(listView.searchField?.value).toBe('apple orange');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(4);
  });

  it('should show searched list by search term min size', () => {
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    (listView.searchField as any).value = 'd';
    expect(listView.searchField?.value).toBe('d');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(24);

    listView.searchTermMinSize = 3;
    (listView.searchField as any).value = 'd';
    expect(listView.searchField?.value).toBe('d');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    (listView.searchField as any).value = 'disc';
    expect(listView.searchField?.value).toBe('disc');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(2);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
  });

  it('should show searched list with custom filter', () => {
    listView.searchFilterCallback = (term: string) => {
      const response = (item: any): boolean => {
        const lcTerm = (term || '').toLowerCase();
        const lcText = (item.comments || '').toLowerCase();

        const match = lcText.indexOf(lcTerm) >= 0;
        return !match;
      };
      return response;
    };
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    (listView.searchField as any).value = 'd';
    expect(listView.searchField?.value).toBe('d');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(25);

    (listView.searchField as any).value = 'disc';
    expect(listView.searchField?.value).toBe('disc');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(1);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
  });

  it('fires filtered event when apply or clear search', () => {
    const itemCountAll = 77;

    expect(listView.searchField).toBeFalsy();
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);

    listView.searchable = true;
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(listView.searchField).toBeTruthy();
    expect(listView.searchField?.value).toBe('');

    const mockCallback = jest.fn((x) => {
      const TYPES = ['apply', 'clear'];
      expect(x.detail.elem).toBeTruthy();
      expect(TYPES).toContain(x.detail.type);
    });
    listView.addEventListener('filtered', mockCallback);

    (listView.searchField as any).value = 'day';
    expect(listView.searchField?.value).toBe('day');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(10);
    expect(mockCallback.mock.calls.length).toBe(1);

    (listView.searchField as any).value = '';
    expect(listView.searchField?.value).toBe('');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(mockCallback.mock.calls.length).toBe(2);

    (listView.searchField as any).value = 'd';
    expect(listView.searchField?.value).toBe('d');
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(24);
    expect(mockCallback.mock.calls.length).toBe(3);

    listView.searchField?.dispatchEvent(new Event('cleared'));
    expect(listView.shadowRoot?.querySelectorAll('div[part="list-item"]').length).toEqual(itemCountAll);
    expect(mockCallback.mock.calls.length).toBe(4);
  });
});
