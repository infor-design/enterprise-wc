/**
 * @jest-environment jsdom
 */
import createFromTemplate from '../helpers/create-from-template';
import '../helpers/resize-observer-mock';

import '../../src/components/ids-breadcrumb/ids-breadcrumb';
import IdsHyperlink from '../../src/components/ids-hyperlink/ids-hyperlink';

describe('IdsBreadcrumb Component', () => {
  let breadcrumb: any;

  beforeEach(async () => {
    const elem: any = new IdsBreadcrumb();
    document.body.appendChild(elem);
    breadcrumb = document.querySelector('ids-breadcrumb');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('renders as expected', () => {
    expect(breadcrumb.outerHTML).toMatchSnapshot();
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
<<<<<<< HEAD:test/ids-breadcrumb/ids-breadcrumb-func-test.js
    breadcrumb = createFromTemplate(breadcrumb, `<ids-breadcrumb></ids-breadcrumb>`);

=======
    const elem: any = new IdsBreadcrumb();
    expect(document.querySelectorAll('ids-breadcrumb').length).toEqual(1);
    document.body.appendChild(elem);
    elem.remove();
>>>>>>> 2f24e047cfdfdad714ec1a1d3373b817aab0e801:test/ids-breadcrumb/ids-breadcrumb-func-test.ts
    expect(document.querySelectorAll('ids-breadcrumb').length).toEqual(1);

    breadcrumb.remove();

    expect(errors).not.toHaveBeenCalled();
  });

  it('adds new crumbs onto the stack', () => {
    breadcrumb.add(new IdsHyperlink());
    breadcrumb.add(new IdsHyperlink());
    expect(breadcrumb.children.length).toEqual(2);

    for (const child of breadcrumb.children) {
      expect(child.getAttribute('role')).toEqual('listitem');
      expect(child.getAttribute('font-size')).toEqual('14');
    }
    expect(breadcrumb.lastElementChild.getAttribute('font-weight')).toEqual('bold');
  });

  it('removes breadcrumb off the stack and returns it', () => {
    breadcrumb.add(new IdsHyperlink());
    breadcrumb.add(new IdsHyperlink());
    expect(breadcrumb.delete() instanceof IdsHyperlink).toEqual(true);
    expect(breadcrumb.children.length).toEqual(1);
    expect(breadcrumb.lastElementChild.fontWeight).toEqual('bold');

    breadcrumb.delete();
    expect(breadcrumb.children.length).toEqual(0);
    expect(breadcrumb.delete()).toEqual(null);
  });

  it('can have a callback set for activation', () => {
    breadcrumb.add(new IdsHyperlink());
    breadcrumb.add(new IdsHyperlink());
    const cb = jest.fn((targetBreadcrumb, currentBreadcrumb) => {
      expect(targetBreadcrumb).toBeDefined();
      expect(currentBreadcrumb).toBeDefined();
    });
    breadcrumb.onBreadcrumbActivate = cb;

    const clickEvent = new MouseEvent('click', { bubbles: true });
    breadcrumb.children[0].dispatchEvent(clickEvent);

    expect(cb.mock.calls.length).toBe(1);
  });

  it('can be truncated', () => {
    breadcrumb.insertAdjacentHTML('afterbegin', `
      <ids-hyperlink id="breadcrumb-1">First Breadcrumb</ids-hyperlink>
      <ids-hyperlink id="breadcrumb-2">Second Breadcrumb</ids-hyperlink>
      <ids-hyperlink id="breadcrumb-3">Third Breadcrumb</ids-hyperlink>
      <ids-hyperlink id="breadcrumb-4">Fourth Breadcrumb</ids-hyperlink>
      <ids-hyperlink id="breadcrumb-5">Fifth Breadcrumb</ids-hyperlink>
      <ids-hyperlink id="breadcrumb-6">Sixth Breadcrumb</ids-hyperlink>
    `);

    // move the breadcrumb to a fixed-size container
    document.body.insertAdjacentHTML('beforeend', `<div id="test-div" style="width: 500px;"></div>`);
    const testDiv = document.querySelector('#test-div');
    testDiv.append(breadcrumb);

    // Test truncation settings
    breadcrumb.truncate = true;
    expect(breadcrumb.hasVisibleActions()).toBeTruthy();
    expect(breadcrumb.popupMenuGroupEl.children.length).toEqual(breadcrumb.children.length);

    // Check overflow links are working
    const firstLink = breadcrumb.children[0];
    const firstMenuItem = breadcrumb.popupMenuGroupEl.children[0];
    expect(firstMenuItem.overflowTarget.isEqualNode(firstLink)).toBeTruthy();

    // Disable truncation
    breadcrumb.truncate = false;
    expect(breadcrumb.hasVisibleActions()).toBeFalsy();
    expect(breadcrumb.popupMenuGroupEl.children.length).toBe(0);
  });

  it('styles links correctly', () => {
    expect(breadcrumb.outerHTML).toMatchSnapshot();
  });
});
