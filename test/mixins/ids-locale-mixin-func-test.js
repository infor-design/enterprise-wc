/**
 * @jest-environment jsdom
 */
import IdsText from '../../src/components/ids-text/ids-text';

let elem;

describe('IdsLocaleMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsText();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  it('locale is empty when no container', async () => {
    expect(elem.locale).toBeFalsy();
  });
});
