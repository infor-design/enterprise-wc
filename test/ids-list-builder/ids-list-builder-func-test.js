/**
 * @jest-environment jsdom
 */
import IdsListBuilder from '../../src/components/ids-list-builder/ids-list-builder';

const sampleData = [
  {
    id: 1,
    productId: '7439937961',
    productName: 'Steampan Lid',
    inStock: true,
    units: '9',
    unitPrice: 23,
    color: 'Green'
  },
  {
    id: 2,
    productId: '3672150959',
    productName: 'Coconut - Creamed, Pure',
    inStock: true,
    units: '588',
    unitPrice: 18,
    color: 'Yellow'
  },
  {
    id: 3,
    productId: '8233719404',
    productName: 'Onions - Red',
    inStock: false,
    units: '68',
    unitPrice: 58,
    color: 'Green'
  },
  {
    id: 4,
    productId: '2451410442',
    productName: 'Pasta - Fusili Tri - Coloured',
    inStock: true,
    units: '02',
    unitPrice: 24,
    color: 'Crimson'
  },
  {
    id: 5,
    productId: '4264251249',
    productName: 'Bread - Crumbs, Bulk',
    inStock: true,
    units: '5',
    unitPrice: 59,
    color: 'Maroon'
  },
];

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

  it('injects template correctly and sets data correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsListBuilder.data = sampleData;
  });
});
