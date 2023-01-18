/**
 * @jest-environment jsdom
 */
import IdsButton from '../../src/components/ids-button/ids-button';

describe('IdsHideFocusMixin Tests', () => {
  let idsButton: any;

  beforeEach(async () => {
    // create ids button
    idsButton = new IdsButton();
    idsButton.innerHTML = '<span>Default Button</span>';
    document.body.appendChild(idsButton);
  });

  afterEach(async () => {
    // clear body
    document.body.innerHTML = '';
  });

  it('should add ripple effect on click.ripple', async () => {

  });
});
