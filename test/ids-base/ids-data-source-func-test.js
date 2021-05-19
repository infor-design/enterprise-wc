/**
 * @jest-environment jsdom
 */
import IdsDataSource from '../../src/ids-base/ids-data-source';

describe.only('IdsDataSourceMixin Tests', () => {
  let datasource;

  beforeEach(async () => {
    datasource = new IdsDataSource();
  });

  it('can set data as source', () => {
    const dataset = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];

    datasource.data = dataset;
    dataset[0].prop1 = 'a';

    expect(datasource.data[0].prop1).toEqual(1);
  });

  it('can iterate', () => {
    const dataset = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];

    datasource.data = dataset;

    datasource.forEach((data) => {
      expect(data.prop1).toEqual(1);
      expect(data.prop2).toEqual(2);
    });
  });

  it('can sort', () => {
    const dataset = [{ prop1: 1, prop2: 1 }, { prop1: 2, prop2: 2 }];

    datasource.data = dataset;
    datasource.sort('prop1', false);

    expect(datasource.data[0].prop1).toEqual(2);
    expect(datasource.data[0].prop2).toEqual(2);
    expect(datasource.data[1].prop1).toEqual(1);
    expect(datasource.data[1].prop2).toEqual(1);
  });

  it('can sort inverse', () => {
    const dataset = [{ prop1: 1, prop2: 1 }, { prop1: 2, prop2: 2 }];

    datasource.data = dataset;
    datasource.sort('prop1', true);

    expect(datasource.data[0].prop1).toEqual(1);
    expect(datasource.data[0].prop2).toEqual(1);
    expect(datasource.data[1].prop1).toEqual(2);
    expect(datasource.data[1].prop2).toEqual(2);
  });

  it('can sort with a primer function', () => {
    const dataset = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];
    const primer = (x) => x;

    datasource.data = dataset;
    datasource.sort('prop1', false, primer);

    expect(datasource.data[0].prop1).toEqual(1);
    expect(datasource.data[0].prop2).toEqual(2);
    expect(datasource.data[1].prop1).toEqual(1);
    expect(datasource.data[1].prop2).toEqual(2);
  });

  it('can sort alpha', () => {
    const dataset = [
      { prop1: 'a', prop2: 'a' },
      { prop1: 'b', prop2: 'b' },
      { prop1: 'a', prop2: 'a' },
      { prop1: 'b', prop2: 'b' },
      { prop1: 'a', prop2: 'a' },
      { prop1: 'a', prop2: 'a' }
    ];
    const primer = (x) => x;

    datasource.data = dataset;
    datasource.sort('prop1', false, primer);

    expect(datasource.data[0].prop1).toEqual('b');
    expect(datasource.data[1].prop1).toEqual('b');
    expect(datasource.data[2].prop1).toEqual('a');
    expect(datasource.data[3].prop1).toEqual('a');
    expect(datasource.data[4].prop1).toEqual('a');
    expect(datasource.data[5].prop1).toEqual('a');
  });
});
