/**
 * @jest-environment jsdom
 */

 import IdsTimePicker from '../../src/ids-time-picker/ids-time-picker';

 describe('IdsTimePicker Component', () => {
   let timepicker;

   beforeEach(async () => {
     timepicker = new IdsTimePicker();
     document.body.appendChild(timepicker);
   });

   afterEach(async ()=> {
     document.body.innerHTML = '';
     timepicker = null;
   });

   it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    timepicker.remove();
    const elem = new IdsTimePicker();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-time-picker').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
   });
 });