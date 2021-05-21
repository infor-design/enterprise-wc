/**
 * @jest-environment jsdom
 */

import IdsRating from '../../src/ids-rating/ids-rating';

describe('IdsRating Component', () => {
  let rating;

  beforeEach(async () => {
    rating = new IdsRating();
    rating.value = 0;
    rating.readonly = false;
    rating.size = 'large';

    document.body.appendChild(rating);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
    rating = null;
  });

  it('renders with no errors', () => {
    const errors = jest.spyOn(global.console, 'error');
    rating.remove();
    const elem = new IdsRating();
    document.body.appendChild(elem);
    expect(document.querySelectorAll('ids-rating').length).toEqual(1);
    expect(errors).not.toHaveBeenCalled();
    elem.remove();
  });

  it('can set the value attribute', () => {
    rating.value = 3;
    const firstIcon = rating.shadowRoot.querySelector('ids-icon');

    expect(rating.shadowRoot.querySelectorAll('ids-icon').length).toEqual(5);
    firstIcon.setAttribute('icon', 'star-outlined');
    expect(firstIcon.getAttribute('icon')).toEqual('star-outlined');
    expect(rating.getAttribute('value')).toEqual('3');
  });

  it('has a readonly attribute', () => {
    rating.readonly = 'true';
    expect(rating.getAttribute('readonly')).toEqual('true');
  });

  it('has a size attribute', () => {
    rating.size = 'large';
    expect(rating.getAttribute('size')).toEqual('large');
  });

  it('has stars attribute', () => {
    rating.stars = 4;
    expect(rating.getAttribute('stars')).toEqual('4');
  });

  it('does not set stars if empty', () => {
    rating.stars = null;
    expect(rating.getAttribute('stars')).toEqual(null);
  });

  it('supports half stars', () => {
    const elem = new IdsRating();
    elem.readonly = true;
    elem.stars = 5;
    elem.value = 3.5;
    document.body.appendChild(elem);
    expect(document.querySelector('ids-rating').shadowRoot.querySelectorAll('.star').length).toEqual(5);
  });
});
