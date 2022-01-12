/**
 * @jest-environment jsdom
 */
import IdsSwapList from '../../src/components/ids-swaplist/ids-swaplist';

const HTMLSnippets = {
  SWAPLIST_COMPONENT: (
  `<ids-swaplist>
  </ids-swaplist>`
  ),
};

describe('IdsSwapList Component', () => {
  let idsSwapList;

  const createElemViaTemplate = async (innerHTML) => {
    idsSwapList?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsSwapList = template.content.childNodes[0];

    document.body.appendChild(idsSwapList);

    return idsSwapList;
  };

  afterEach(async () => {
    idsSwapList?.remove();
  });

  it('renders with no errors', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    idsSwapList.remove();

    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.SWAPLIST_COMPONENT);
    idsSwapList.template();
    expect(idsSwapList.outerHTML).toMatchSnapshot();
  });

  it('can set the count', async () => {
    expect(idsSwapList.count).toBe(2);
    expect(idsSwapList.getAttribute('count')).toBe(null);

    idsSwapList.count = 3;
    expect(idsSwapList.count).toBe(3);
    expect(idsSwapList.getAttribute('count')).toBe('3');
  });
});
