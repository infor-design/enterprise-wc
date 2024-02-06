/**
 * @jest-environment jsdom
 */
import IdsEmptyMessage from '../../src/components/ids-empty-message/ids-empty-message';
import '../../src/components/ids-text/ids-text';

describe('Ids Empty Message Tests', () => {
  let elem: IdsEmptyMessage;

  const createElemViaTemplate = async (innerHTML: string) => {
    elem?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    elem = template.content.childNodes[0] as IdsEmptyMessage;
    document.body.appendChild(elem);

    return elem;
  };

  beforeEach(async () => {
    elem = await createElemViaTemplate(
      `<ids-empty-message icon="empty-generic">
        <ids-text type="h2" font-size="20" label="true" slot="label">Alert Label</ids-text>
        <ids-text label="true" slot="description">Description of empty message that explains why</ids-text>
        <ids-button slot="button" appearance="primary">BUTTON NAME</ids-button>
      </ids-empty-message>`
    );
  });

  afterEach(async () => {
    document.body.innerHTML = '';
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
