/**
 * @jest-environment jsdom
 */
import IdsListBuilder from '../../src/components/ids-list-builder/ids-list-builder';
import '../helpers/resize-observer-mock';

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
  FULL_COMPONENT: (
    // eslint-disable-next-line no-template-curly-in-string
    '<ids-list-builder height="310px"><template><ids-text font-size="16" type="span">${manufacturerName}</ids-text></template></ids-list-builder>'
  ),
};

describe('IdsListBuilder Component', () => {
  let idsListBuilder: IdsListBuilder | any;

  const createElemViaTemplate = async (innerHTML: any) => {
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

  it('renders empty listbuilder with no errors', () => {
    document.body.innerHTML = '';
    const errors = jest.spyOn(global.console, 'error');
    const elem: any = new IdsListBuilder();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-list-builder').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('renders virtual scroll and ignores it', () => {
    document.body.innerHTML = '';
    const elem: any = new IdsListBuilder();
    elem.virtualScroll = true;
    document.body.appendChild(elem);
    expect(elem.virtualScroll).toEqual(false);
    elem.remove();
  });

  it('renders with no errors', async () => {
    document.body.innerHTML = '';
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
    expect(idsListBuilder.outerHTML).toMatchSnapshot();
    expect(idsListBuilder.container.querySelector('#button-add')).toBeTruthy();
  });

  it('injects template correctly and sets data correctly', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.VANILLA_COMPONENT);
    idsListBuilder.data = sampleData;
  });

  it('renders the header', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    expect(idsListBuilder.container.querySelector('#button-add')).toBeTruthy();
  });

  // TODO: Errors are thrown when the button is clicked for no items
  it.skip('can add items with the button when empty', async () => {
    idsListBuilder = await createElemViaTemplate(HTMLSnippets.FULL_COMPONENT);
    idsListBuilder.container.querySelector('#button-add').click();
  });
});
