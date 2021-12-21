/**
 * @jest-environment jsdom
 */
import IdsSwapList from '../../src/components/ids-swaplist';

const HTMLSnippets = {
  VANILLA_COMPONENT: (
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
    idsSwapList = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    idsSwapList.remove();

    idsSwapList = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    expect(document.querySelectorAll('ids-swaplist').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsSwapList = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsSwapList.template();
    expect(idsSwapList.outerHTML).toMatchSnapshot();
  });
});
