/**
 * @jest-environment jsdom
 */
import { IdsText } from '../../src/components/ids-text';
import IdsEmptyMessage from '../../src/components/ids-empty-message/ids-empty-message';

describe('Ids Empty Message Tests', () => {
  let elem;

  const createElemViaTemplate = async (innerHTML) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0];
    document.body.appendChild(elem);

    return elem;
  };

  beforeEach(async () => {
    elem = await createElemViaTemplate(
      `<ids-empty-message icon="empty-generic">
        <ids-text type="h2" font-size="20" label="true" slot="label">Alert Label</ids-text>
        <ids-text label="true" slot="description">Description of empty message that explains why and possible contain a hyperlink.</ids-text>
        <ids-button slot="button" type="primary">BUTTON NAME</ids-button>
      </ids-empty-message>`
    );
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    elem = new IdsEmptyMessage();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-empty-message').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(elem.shadowRoot.innerHTML).toMatchSnapshot();
  });

  it('can update the icon', () => {
    expect(elem.getAttribute('icon')).toBe('empty-generic');
    elem.icon = 'empty-no-data';
    expect(elem.getAttribute('icon')).toBe('empty-no-data');
  });

  it('can remove the icon', () => {
    expect(elem.getAttribute('icon')).toBe('empty-generic');
    elem.icon = '';
    expect(elem.getAttribute('icon')).toEqual(null);
  });
});
