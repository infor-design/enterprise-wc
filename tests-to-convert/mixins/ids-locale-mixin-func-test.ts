/**
 * @jest-environment jsdom
 */
import IdsText from '../../src/components/ids-text/ids-text';

let elem: any;

describe('IdsLocaleMixin Tests', () => {
  beforeEach(async () => {
    elem = new IdsText();
    document.body.appendChild(elem);
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('locale is present when no container', async () => {
    expect(elem.localeAPI).toBeTruthy();
  });
});
