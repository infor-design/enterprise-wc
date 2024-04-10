/**
 * @jest-environment jsdom
 */
import IdsHeader from '../../src/components/ids-header/ids-header';

describe('IdsHeader Component', () => {
  let elem: any;

  beforeEach(async () => {
    const header: any = new IdsHeader();
    document.body.appendChild(header);
    elem = document.querySelector('ids-header');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });
});
