/**
 * @jest-environment jsdom
 */
import IdsBadge from '../../src/components/ids-badge/ids-badge';
import '../../src/components/ids-icon/ids-icon';

describe('IdsBadge Component', () => {
  let badge: any;

  beforeEach(async () => {
    const elem: any = new IdsBadge();
    document.body.appendChild(elem);
    badge = document.querySelector('ids-badge');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });
  
  test('should be able to set attributes after append', async () => {
    const elem: any = new IdsBadge();
    document.body.appendChild(elem);
    elem.color = 'error';
    elem.shape = 'round';

    expect(elem.container.classList.contains('round')).toBeTruthy();
    expect(elem.container.getAttribute('color')).toEqual('error');
  });
});
