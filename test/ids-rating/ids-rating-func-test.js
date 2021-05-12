/**
 * @jest-environment jsdom
 */

 import IdsRating from '../../src/ids-rating/ids-rating';

 describe('IdsRating Component', () => {
     let rating;


    beforeEach(async () => {
        const element = `<ids-rating value="0" stars="5" readonly="false" size="large"></ids-rating>`;
        const idsIcon = `<ids-icon icon="star-outlined"></ids-icon>`;
        window.document.body.innerHTML = element;
        rating = window.document.querySelectorAll('ids-rating');
        rating.innerHTML = idsIcon;
    });

    afterEach(async () => {
        window.document.body.innerHTML = '';
        rating = null;
    });

    it('renders with no errors', () => {
        const errors = jest.spyOn(global.console, 'error');
        expect(rating.length).toEqual(1);
        expect(errors).not.toHaveBeenCalled();
    });

    it('Has value attribute', () => {
        const el = rating[0];
        const icon = window.document.querySelectorAll('ids-icon')[0]
        el.setAttribute('value', '3');
        expect(el.getAttribute('value')).toEqual('3');
    });

    it('Has readonly attribute', () => {
        const el = rating[0];
        el.setAttribute('readonly', 'true');
        expect(el.getAttribute('readonly')).toEqual('true');
    })

    it('Has size attribute', () => {
        const el = rating[0];
        el.setAttribute('size', 'large');
        expect(el.getAttribute('size')).toEqual('large');
    });

    it('Has stars', () => {
        const el = rating[0];
        el.setAttribute('stars', '5');
        expect(el.getAttribute('stars')).toEqual('5');
    })
 })