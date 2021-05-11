/**
 * @jest-environment jsdom
 */

 import IdsRating from '../../src/ids-rating/ids-rating';

 describe('IdsRating Component', () => {
     let rating;

    beforeEach(async () => {
        const element = `<ids-rating></ids-rating>`
        window.document.body.innerHTML = element;
    });

    afterEach(async () => {
        window.document.body.innerHTML = '';
        rating = null;
    });

    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        expect(window.document.querySelectorAll('ids-rating').length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });
 })