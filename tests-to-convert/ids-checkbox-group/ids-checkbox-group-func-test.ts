/**
 * @jest-environment jsdom
 */
import IdsCheckboxGroup from '../../src/components/ids-checkbox-group/ids-checkbox-group';
import '../../src/components/ids-checkbox/ids-checkbox';

describe('IdsCheckboxGroup Component', () => {
  let checkboxGroup: any;

  beforeEach(async () => {
    const elem: any = new IdsCheckboxGroup();
    document.body.appendChild(elem);
    checkboxGroup = document.querySelector('ids-checkbox-group');
  });

  afterEach(async () => {
    document.body.innerHTML = '';
  });
});
