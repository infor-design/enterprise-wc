/**
 * @jest-environment jsdom
 */

 import IdsRating from '../../src/ids-rating/ids-rating';

 describe('IdsRating Component', () => {
     let rating;
     let icons;

    beforeEach(async () => {
        const element = `
        <ids-rating value="0" stars="5" readonly="false" size="large">
            <div id="rating">
                <ids-icon class="star star-0" aria-label="Star-0" role="button" icon="star-outlined" tabindex="0" size="large"></ids-icon>
                <ids-icon class="star star-1" aria-label="Star-1" role="button" icon="star-outlined" tabindex="0" size="large"></ids-icon>
                <ids-icon class="star star-2" aria-label="Star-2" role="button" icon="star-outlined" tabindex="0" size="large"></ids-icon>
                <ids-icon class="star star-3" aria-label="Star-3" role="button" icon="star-outlined" tabindex="0" size="large"></ids-icon>
                <ids-icon class="star star-4" aria-label="Star-4" role="button" icon="star-outlined" tabindex="0" size="large"></ids-icon>
            </div>
        </ids-rating>`;
        const idsIcon = `<ids-icon icon="star-outlined"></ids-icon>`;
        window.document.body.innerHTML = element;
        rating = window.document.querySelectorAll('ids-rating');
        icons = window.document.querySelectorAll('ids-icon');
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
        el.setAttribute('value', '3');
        const iconSetAttr = window.document.querySelectorAll('ids-icon')[0]
        iconSetAttr.setAttribute('icon', 'star-outlined');
        expect(iconSetAttr.getAttribute('icon')).toEqual('star-outlined')
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

    it('Has stars attribute', () => {
        const el = rating[0];
        el.setAttribute('stars', '5');
        expect(el.getAttribute('stars')).toEqual('5');
    })
 })