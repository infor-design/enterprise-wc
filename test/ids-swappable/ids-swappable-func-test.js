/**
 * @jest-environment jsdom
 */
import IdsSwappable from '../../src/components/ids-swappable/ids-swappable';
import IdsSwappableItem from '../../src/components/ids-swappable/ids-swappable-item';

const HTMLSnippets = {
  SWAPPABLE_COMPONENT: (
    `<ids-swappable-item id="swappable-1">
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
      <ids-swappable-item></ids-swappable-item>
    </ids-swappable>`
  ),
};

describe('IdsSwappable Component', () => {
  let idsSwappable;

  const createElemViaTemplate = async (innerHTML) => {
    idsSwappable?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwappable = template.content.childNodes[0];

    document.body.appendChild(idsSwappable);

    return idsSwappable;
  };

  beforeEach(async () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => cb());
    document.body.appendChild(idsSwappable);
  });

  afterEach(async () => {
    idsSwappable?.remove();
  });

  it('renders with no errors', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    idsSwappable.remove();

    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwappable = await createElemViaTemplate(HTMLSnippets.SWAPPABLE_COMPONENT);
    idsSwappable.template();
    expect(idsSwappable.outerHTML).toMatchSnapshot();
  });
});
