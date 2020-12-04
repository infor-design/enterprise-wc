/**
 * @jest-environment jsdom
 */
import { IdsDataSourceMixin } from '../../src/ids-base/ids-data-source-mixin';

describe('IdsDataSourceMixin Tests', () => {
  let datasource;

  beforeEach(async () => {
    datasource = new IdsDataSourceMixin();
  });

  it('can set data as source', () => {
    const dataset = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];

    datasource.data = dataset;
    dataset[0].prop1 = 'a';

    expect(datasource.data[0].prop1).toEqual(1);
  });
});
