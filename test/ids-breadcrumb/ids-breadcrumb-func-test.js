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
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-breadcrumb').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('pushes new crumbs onto the stack', () => {
    breadcrumb.push(new IdsHyperlink());
    breadcrumb.push(new IdsHyperlink());
    expect(breadcrumb.children.length).toEqual(2);
    for (const child of breadcrumb.children) {
      expect(child.getAttribute('color')).toEqual('unset');
      expect(child.getAttribute('role')).toEqual('listitem');
      expect(child.getAttribute('font-size')).toEqual('14');
    }
    expect(breadcrumb.lastElementChild.getAttribute('font-weight')).toEqual('bolder');
  });

  it('pops breadcrumb off the stack and returns it', () => {
    breadcrumb.push(new IdsHyperlink());
    breadcrumb.push(new IdsHyperlink());
    expect(breadcrumb.pop() instanceof IdsHyperlink).toEqual(true);
    expect(breadcrumb.children.length).toEqual(1);
    expect(breadcrumb.lastElementChild.fontWeight).toEqual('bolder');
    breadcrumb.pop();
    expect(breadcrumb.children.length).toEqual(0);
    expect(breadcrumb.pop()).toEqual(null);
  });

  it('renders correctly', () => {
    expect(breadcrumb.outerHTML).toMatchSnapshot();
  });
});
