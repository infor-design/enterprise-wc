/**
 * @jest-environment jsdom
 */
import IdsBreadcrumb from '../../src/ids-breadcrumb/ids-breadcrumb';
import IdsHyperlink from '../../src/ids-hyperlink/ids-hyperlink';

describe('IdsBreadcrumb Component', () => {
  let breadcrumb;

  beforeEach(async () => {
    const elem = new IdsBreadcrumb();
    document.body.appendChild(elem);
    breadcrumb = document.querySelector('ids-breadcrumb');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    const elem = new IdsBreadcrumb();
    expect(document.querySelectorAll('ids-breadcrumb').length).toEqual(1);
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-breadcrumb').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('adds new crumbs onto the stack', () => {
    breadcrumb.add(new IdsHyperlink());
    breadcrumb.add(new IdsHyperlink());
    expect(breadcrumb.children.length).toEqual(2);
    for (const child of breadcrumb.children) {
      expect(child.getAttribute('color')).toEqual('unset');
      expect(child.getAttribute('role')).toEqual('listitem');
      expect(child.getAttribute('font-size')).toEqual('14');
    }
    expect(breadcrumb.lastElementChild.getAttribute('font-weight')).toEqual('bolder');
  });

  it('removes breadcrumb off the stack and returns it', () => {
    breadcrumb.add(new IdsHyperlink());
    breadcrumb.add(new IdsHyperlink());
    expect(breadcrumb.delete() instanceof IdsHyperlink).toEqual(true);
    expect(breadcrumb.children.length).toEqual(1);
    expect(breadcrumb.lastElementChild.fontWeight).toEqual('bolder');
    breadcrumb.delete();
    expect(breadcrumb.children.length).toEqual(0);
    expect(breadcrumb.delete()).toEqual(null);
  });

  it('renders correctly', () => {
    expect(breadcrumb.outerHTML).toMatchSnapshot();
  });
});
