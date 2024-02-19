/**
 * @jest-environment jsdom
 */
import { parents } from '../../src/utils/ids-dom-utils/ids-dom-utils';


import '../../src/components/ids-container/ids-container';
import '../../src/components/ids-layout-grid/ids-layout-grid';
import '../../src/components/ids-card/ids-card';
import '../../src/components/ids-list-view/ids-list-view';
import '../../src/components/ids-text/ids-text';

describe('IdsDomUtils Tests', () => {
  afterEach(async () => {
    document.body.innerHTML = '';
  });

  test('can find parent nodes until matching the provided selector', async () => {
    document.body.innerHTML = `
      <ids-container role="main" padding="8" hidden>
        <ids-layout-grid cols="2" gap="md">
          <ids-layout-grid-cell>
            <div id="parent">
              <ids-card class="card-test">
                <div slot="card-header">test-header</div>
                <div slot="card-content">
                  <ids-list-view>
                    <template>
                      <ids-text font-size="16" type="h2">\${productName} - test</ids-text>
                    </template>
                  </ids-list-view>
                </div>
              </ids-card>
            </div>
          </ids-layout-grid-cell>
        </ids-layout-grid>
      </ids-container>`;

    const body = document.querySelector('body');
    const idsContainer = body?.querySelector('ids-container');
    const idsGrid = idsContainer?.querySelector('ids-layout-grid');
    const idsGridCell = idsGrid?.querySelector('ids-layout-grid-cell');
    const parent = idsGridCell?.querySelector('#parent');
    const idsCard = parent?.querySelector('.card-test');
    const cardContent = idsCard?.querySelector('[slot="card-content"]');
    const idsListView: any = cardContent?.querySelector('ids-list-view');

    const dataset = [{ id: 1, productName: 'Steampan Lid' }, { id: 2, productName: 'Coconut' }];
    idsListView.data = dataset;

    const idsListViewShadowRoot = idsListView?.shadowRoot;
    const idsListViewContainer = idsListViewShadowRoot?.querySelector('.ids-list-view');
    const listItemBody = idsListViewContainer?.querySelector('.ids-list-view-body');
    const listItem = listItemBody?.querySelector('[part="list-item"]');
    const idsText = listItem?.querySelector('ids-text');
    const idsTextShadowRoot = idsText?.shadowRoot;
    const h2 = idsTextShadowRoot?.querySelector('h2');

    expect(parents(h2)).toEqual([
      idsTextShadowRoot,
      idsText,
      listItem,
      listItemBody,
      idsListViewContainer,
      idsListViewShadowRoot,
      idsListView,
      cardContent,
      idsCard,
      parent,
      idsGridCell,
      idsGrid,
      idsContainer,
      body
    ]);

    expect(parents(h2, '[slot="card-content"]')).toEqual([
      idsTextShadowRoot,
      idsText,
      listItem,
      listItemBody,
      idsListViewContainer,
      idsListViewShadowRoot,
      idsListView,
      cardContent
    ]);

    expect(parents(h2, '.card-test')).toEqual([
      idsTextShadowRoot,
      idsText,
      listItem,
      listItemBody,
      idsListViewContainer,
      idsListViewShadowRoot,
      idsListView,
      cardContent,
      idsCard
    ]);

    expect(parents(h2, '#parent')).toEqual([
      idsTextShadowRoot,
      idsText,
      listItem,
      listItemBody,
      idsListViewContainer,
      idsListViewShadowRoot,
      idsListView,
      cardContent,
      idsCard,
      parent
    ]);

    expect(parents(h2, 'ids-container')).toEqual([
      idsTextShadowRoot,
      idsText,
      listItem,
      listItemBody,
      idsListViewContainer,
      idsListViewShadowRoot,
      idsListView,
      cardContent,
      idsCard,
      parent,
      idsGridCell,
      idsGrid,
      idsContainer
    ]);
  });
});
