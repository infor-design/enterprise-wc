//import  {expect, test} from '@playwright/test'
import AxeBuilder from '@axe-core/playwright';
import percySnapshot from '@percy/playwright';
import { expect } from '@playwright/test';
import { test } from '../base-fixture';

import IdsCard from '../../src/components/ids-card/ids-card';

test.beforeEach(async({page}) => {
    await page.goto('http://localhost:4300/ids-card/example.html')
    
});

test.describe('Cards tests',() => {

    test('general page checks', async ({page}) => {

        await page.getByText('Cards').isVisible();

    })

    test('should match innerHTML snapshot', async ({page}) => {
        if (browserName !== 'chromium') return;
        const handle = await page.getAttribute('.ids-card');
        const html = await handle?.evaluate((el: IdsCard) => el?.outerHTML);
        await expect(html).toMatchSnapshot('card-html'); 

    })
})