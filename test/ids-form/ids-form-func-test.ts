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
    const elem: IdsForm | HTMLElement | Node | any = new IdsForm();
    document.body.appendChild(elem);
    elem.remove();
    expect(document.querySelectorAll('ids-form').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
  });

  it('renders with autocomplete', () => {
    const autocompleteString = 'true';
    form.autocomplete = autocompleteString;
    expect(form.getAttribute('autocomplete')).toEqual(autocompleteString);
  });

  it('renders with compact', () => {
    const compactString = 'false';
    form.compact = compactString;
    expect(form.getAttribute('compact')).toEqual(compactString);
  });

  it('renders with id', () => {
    const idString = 'ids-form-id';
    form.id = idString;
    expect(form.getAttribute('id')).toEqual(idString);
  });

  it('renders with method', () => {
    const methodString = 'post';
    form.method = methodString;
    expect(form.getAttribute('method')).toEqual(methodString);
  });

  it('renders with name', () => {
    const nameString = 'ids-form-name';
    form.setAttribute('name', nameString);
    expect(form.getAttribute('name')).toEqual(nameString);
  });

  it('renders with target', () => {
    const targetString = 'path/to/target/file.php';
    form.target = targetString;
    expect(form.getAttribute('target')).toEqual(targetString);
  });

  it('renders with title', () => {
    const titleString = 'ids-form-title';
    form.title = titleString;
    expect(form.getAttribute('title')).toEqual(titleString);
  });
});
