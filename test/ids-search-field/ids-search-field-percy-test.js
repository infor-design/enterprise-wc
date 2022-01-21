import percySnapshot from '@percy/puppeteer';
import waitForPageLoad from '../helpers/wait-for-page-load';

describe('Ids Search Field Percy Tests', () => {
  const url = 'http://localhost:4444/ids-search-field';

  it('should not have visual regressions in new light theme (percy)', async () => {
    await waitForPageLoad(url, null, 30);
    await percySnapshot(page, 'ids-search-field-new-light');
  });

  it('should not have visual regressions in new dark theme (percy)', async () => {
    await waitForPageLoad(url, 'dark', 30);
    await percySnapshot(page, 'ids-search-field-new-dark');
  });

  it('should not have visual regressions in new contrast theme (percy)', async () => {
    await waitForPageLoad(url, 'contrast', 30);
    await percySnapshot(page, 'ids-search-field-new-contrast');
  });
});
