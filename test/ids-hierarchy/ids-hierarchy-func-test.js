/**
 * @jest-environment jsdom
 */
import processAnimFrame from '../helpers/process-anim-frame';
import IdsHierarchy from '../../src/components/ids-hierarchy';
import IdsHierarchyItem from '../../src/components/ids-hierarchy/ids-hierarchy-item';
import IdsContainer from '../../src/components/ids-container';

const DEFAULT_HIERARCHY_HTML = (
  `<ids-hierarchy root>
      <ids-hierarchy-item id="item-1" color-variant="full-time">
      <img src="../assets/placeholder-200x200.png" alt="item-1" slot="avatar">
      <ids-text slot="heading">Tony Cleveland</ids-text>
      <ids-text slot="subheading">Director</ids-text>
      <ids-text slot="micro">FT</ids-text>
    </ids-hierarchy-item>
    <ids-hierarchy-item id="item-2" color-variant="part-time">
      <ids-text slot="heading">Julie Dawes</ids-text>
      <ids-text slot="subheading">Records Clerk</ids-text>
      <ids-text slot="micro">PT</ids-text>
    </ids-hierarchy-item>
    <ids-hierarchy-item id="item-3" color-variant="contractor">
      <ids-text slot="heading">Kaylee Edwards</ids-text>
      <ids-text slot="subheading">Records Manager</ids-text>
      <ids-text slot="micro">C</ids-text>

      <ids-hierarchy-item id="item-4" color-variant="open-position">
        <ids-text slot="heading">Julie Dawes</ids-text>
        <ids-text slot="subheading">Records Clerk</ids-text>
        <ids-text slot="micro">OP</ids-text>

        <ids-hierarchy-item id="item-5" color-variant="contractor">
          <ids-text slot="heading">Tony Cleveland</ids-text>
          <ids-text slot="subheading">Director</ids-text>
          <ids-text slot="micro">C</ids-text>
        </ids-hierarchy-item>
      </ids-hierarchy-item>
    </ids-hierarchy-item>
  </ids-hierarchy>`
);

describe('IdsHierarchy Component', () => {
  let el;
  let item;
  let container;

  beforeEach(async () => {
    const elem = new IdsHierarchy();
    const elemItem = new IdsHierarchyItem();
    document.body.appendChild(elem);
    elem.appendChild(elemItem);
    el = document.querySelector('ids-hierarchy');
    item = document.querySelector('ids-hierarchy-item');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    el = null;
  });

  const createElemViaTemplate = async (innerHTML) => {
    el?.remove?.();
    container = new IdsContainer();

    const template = document.createElement('template');
    template.innerHTML = innerHTML;
    el = template.content.childNodes[0];
    container.appendChild(el);
    document.body.appendChild(container);

    await processAnimFrame();

    return el;
  };

  it('renders from HTML Template with no errors', async () => {
    el = await createElemViaTemplate(DEFAULT_HIERARCHY_HTML);

    const errors = jest.spyOn(global.console, 'error');
    expect(document.querySelectorAll('ids-hierarchy').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders correctly', () => {
    expect(el.outerHTML).toMatchSnapshot();
    expect(item.outerHTML).toMatchSnapshot();
  });

  it('can set the expanded attribute', () => {
    expect(item.getAttribute('expanded')).toBe(null);

    item.setAttribute('expanded', true);
    expect(item.getAttribute('expanded')).toBe('true');

    item.expanded = null;
    expect(item.getAttribute('expanded')).toBe(null);
  });

  it('can set the expanded attribute', () => {
    expect(item.getAttribute('expanded')).toBe(null);

    item.setAttribute('expanded', true);
    expect(item.getAttribute('expanded')).toBe('true');

    item.expanded = null;
    expect(item.getAttribute('expanded')).toBe(null);
  });

  it('can set the root-item attribute', () => {
    expect(item.getAttribute('root-item')).toBe(null);

    item.setAttribute('root-item', true);
    expect(item.getAttribute('root-item')).toBe('true');

    item.rootItem = null;
    item.removeAttribute('root-item');
    expect(item.rootItem).toBe(null);
    expect(item.getAttribute('root-item')).toBe(null);
  });

  it('can set the selected attribute', () => {
    expect(item.getAttribute('selected')).toBe(null);

    item.setAttribute('selected', true);
    item.selected = true;
    expect(item.selected).toBe(true);
    expect(item.getAttribute('selected')).toBe('true');

    item.selected = null;
    expect(item.selected).toBe(false);
    expect(item.getAttribute('selected')).toBe(null);
  });

  it('can expand and collapse items when clicked', () => {
    const event = new MouseEvent('click', {
      target: item.expander,
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    item.expander.dispatchEvent(event);
    expect(item.expanded).toBe('true');

    // Collapse
    item.expander.dispatchEvent(event);
    expect(item.expanded).toBe(null);
  });

  it('can expand and collapse items when touchstart', () => {
    const event = new TouchEvent('touchstart', {
      touches: [{
        identifier: '123',
        pageX: 0,
        pageY: 0,
        target: item.expander
      }],
      bubbles: true,
      cancelable: true,
      view: window
    });

    // Expand
    item.expander.dispatchEvent(event);
    expect(item.expanded).toBe('true');

    // Collapse
    item.expander.dispatchEvent(event);
    expect(item.expanded).toBe(null);
  });

  it('checks for nested items', async () => {
    el = await createElemViaTemplate(DEFAULT_HIERARCHY_HTML);
    expect(el.container.classList.contains('has-nested-items')).toBe(false);
  });
});
