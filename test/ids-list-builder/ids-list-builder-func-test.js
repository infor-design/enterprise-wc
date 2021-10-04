/**
 * @jest-environment jsdom
 */
import IdsListBuilder from '../../src/components/ids-list-builder';

const HTMLSnippets = {
  VANILLA_COMPONENT: (
  `<ids-list-builder>
  </ids-list-builder>`
  ),
};

describe('IdsListBuilder Component', () => {
  let idsListBuilder;

  const createElemViaTemplate = async (innerHTML) => {
    idsListBuilder?.remove?.();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    idsListBuilder = template.content.childNodes[0];

    document.body.appendChild(idsListBuilder);

    return idsListBuilder;
  };

  afterEach(async () => {
    idsListBuilder?.remove();
  });

  it('renders with no errors', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);

    idsListBuilder.remove();

    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);

    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsListBuilder.template();
    expect(idsListBuilder.outerHTML).toMatchSnapshot();
  });
});
