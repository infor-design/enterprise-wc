/**
 * @jest-environment jsdom
 */

 import IdsForm from '../../src/components/ids-form/ids-form';

 describe('IdsForm Component', () => {
   let form: any;
 
   beforeEach(async () => {
     const elem: IdsForm | HTMLElement | Node | any = new IdsForm();
     document.body.appendChild(elem);
     form = document.querySelector('ids-form');
   });
 
   afterEach(async () => {
     document.body.innerHTML = '';
   });
 
   it('renders with no errors', () => {
     const errors = jest.spyOn(global.console, 'error');
     const elem: IdsForm | HTMLElement | Node | any = new IdsForm()
     document.body.appendChild(elem);
     elem.remove();
     expect(document.querySelectorAll('ids-form').length).toEqual(1);
     expect(errors).not.toHaveBeenCalled();
   });
 
  //  it('renders with action', () => {
  //    let actionString = 'path/to/form/action.php';
  //    form.action = actionString;
  //    expect(form.getAttribute('action')).toEqual(actionString);
  //    form.setAttribute('action', '');
  //    expect(form.getAttribute('action')).toEqual('');
  //  });
 
   it('renders with autocomplete', () => {
     let autocompleteString = 'true';
     form.autocomplete = autocompleteString;
     expect(form.getAttribute('autocomplete')).toEqual(autocompleteString);
   });
 
   it('renders with compact', () => {
     let compactString = 'false';
     form.compact = compactString;
     expect(form.getAttribute('compact')).toEqual(compactString);
   });
 
   it('renders with id', () => {
     let idString = 'ids-form-id';
     form.id = idString;
     expect(form.getAttribute('id')).toEqual(idString);
   });
 
   it('renders with method', () => {
     let methodString = 'post';
     form.method = methodString;
     expect(form.getAttribute('method')).toEqual(methodString);
   });
 
   it('renders with name', () => {
     let nameString = 'ids-form-name';
     form.setAttribute('name', nameString);
     expect(form.getAttribute('name')).toEqual(nameString);
   });
 
   it('renders with target', () => {
     let targetString = 'path/to/target/file.php';
     form.target = targetString;
     expect(form.getAttribute('target')).toEqual(targetString);
   });
 
   it('renders with title', () => {
     let titleString = 'ids-form-title';
     form.title = titleString;
     expect(form.getAttribute('title')).toEqual(titleString);
   });
 
 });
 