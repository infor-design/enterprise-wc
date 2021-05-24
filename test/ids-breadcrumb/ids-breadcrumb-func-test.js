/**
 * @jest-environment jsdom
 */
 import IdsBreadcrumb from '../../src/ids-breadcrumb/ids-breadcrumb';
 import IdsText from '../../src/ids-text/ids-text';
 
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
 
   it('renders correctly', () => {
     expect(breadcrumb.outerHTML).toMatchSnapshot();
   });
 });
 