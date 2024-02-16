/**
 * @jest-environment jsdom
 */
import IdsDataSource from '../../src/core/ids-data-source';

describe('IdsDataSource Tests', () => {
  let datasource: any;

  beforeEach(async () => {
    datasource = new IdsDataSource();
  });

  test('can set data as source', () => {
    const dataset: any = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];

    datasource.data = dataset;
    dataset[0].prop1 = 'a';

    expect(datasource.data[0].prop1).toEqual(1);
  });

  test('can iterate', () => {
    const dataset = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];

    datasource.data = dataset;

    datasource.forEach((data: any) => {
      expect(data.prop1).toEqual(1);
      expect(data.prop2).toEqual(2);
    });
  });

  test('can sort', () => {
    const dataset = [{ prop1: 1, prop2: 1 }, { prop1: 2, prop2: 2 }];

    datasource.data = dataset;
    datasource.sort('prop1', false);

    expect(datasource.data[0].prop1).toEqual(2);
    expect(datasource.data[0].prop2).toEqual(2);
    expect(datasource.data[1].prop1).toEqual(1);
    expect(datasource.data[1].prop2).toEqual(1);
  });

  test('can sort inverse', () => {
    const dataset = [{ prop1: 1, prop2: 1 }, { prop1: 2, prop2: 2 }];

    datasource.data = dataset;
    datasource.sort('prop1', true);

    expect(datasource.data[0].prop1).toEqual(1);
    expect(datasource.data[0].prop2).toEqual(1);
    expect(datasource.data[1].prop1).toEqual(2);
    expect(datasource.data[1].prop2).toEqual(2);
  });

  test('can sort with a primer function', () => {
    const dataset: any = [{ prop1: 1, prop2: 2 }, { prop1: 1, prop2: 2 }];
    const primer = (x: any) => x;

    datasource.data = dataset;
    datasource.sort('prop1', false, primer);

    expect(datasource.data[0].prop1).toEqual(1);
    expect(datasource.data[0].prop2).toEqual(2);
    expect(datasource.data[1].prop1).toEqual(1);
    expect(datasource.data[1].prop2).toEqual(2);
  });

  test('can sort alpha', () => {
    const dataset = [
      { prop1: 'a', prop2: 'a' },
      { prop1: 'b', prop2: 'b' },
      { prop1: 'a', prop2: 'a' },
      { prop1: 'b', prop2: 'b' },
      { prop1: 'a', prop2: 'a' },
      { prop1: 'a', prop2: 'a' }
    ];
    const primer = (x: any) => x;

    datasource.data = dataset;
    datasource.sort('prop1', false, primer);

    expect(datasource.data[0].prop1).toEqual('b');
    expect(datasource.data[1].prop1).toEqual('b');
    expect(datasource.data[2].prop1).toEqual('a');
    expect(datasource.data[3].prop1).toEqual('a');
    expect(datasource.data[4].prop1).toEqual('a');
    expect(datasource.data[5].prop1).toEqual('a');
  });

  test('sorts numbers ahead of strings in ascending mode, opposite in descending mode', () => {
    const dataset = [
      { id: 0, prop1: '1' },
      { id: 4, prop1: '1a' },
      { id: 1, prop1: '2' },
      { id: 2, prop1: '07' },
      { id: 9, prop1: 'c' },
      { id: 6, prop1: '2ab' },
      { id: 3, prop1: '11' },
      { id: 8, prop1: 'B' },
      { id: 5, prop1: '22a' },
      { id: 7, prop1: 'a' }
    ];

    datasource.data = dataset;
    datasource.sort('prop1', true);

    expect(datasource.data[0].prop1).toEqual('1');
    expect(datasource.data[1].prop1).toEqual('2');
    expect(datasource.data[2].prop1).toEqual('07');
    expect(datasource.data[3].prop1).toEqual('11');
    expect(datasource.data[4].prop1).toEqual('1a');
    expect(datasource.data[5].prop1).toEqual('22a');
    expect(datasource.data[6].prop1).toEqual('2ab');
    expect(datasource.data[7].prop1).toEqual('a');
    expect(datasource.data[8].prop1).toEqual('B');
    expect(datasource.data[9].prop1).toEqual('c');

    datasource.sort('prop1', false);

    expect(datasource.data[0].prop1).toEqual('c');
    expect(datasource.data[1].prop1).toEqual('B');
    expect(datasource.data[2].prop1).toEqual('a');
    expect(datasource.data[3].prop1).toEqual('2ab');
    expect(datasource.data[4].prop1).toEqual('22a');
    expect(datasource.data[5].prop1).toEqual('1a');
    expect(datasource.data[6].prop1).toEqual('11');
    expect(datasource.data[7].prop1).toEqual('07');
    expect(datasource.data[8].prop1).toEqual('2');
    expect(datasource.data[9].prop1).toEqual('1');
  });

  test('can sort numbers, strings, and empty space similar to Excel', () => {
    const dataset = [
      { productId: 2445204, productName: '01AM', quantity: 3 },
      { productId: 2542205, productName: '01PT', quantity: 4 },
      { productId: 2642205, productName: '02PT', quantity: 41 },
      { productId: 2642206, productName: '03AM', quantity: 41 },
      { productId: 2241202, productName: '1', quantity: 2 },
      { productId: 2342203, productName: '10', quantity: 1 },
      { productId: 2642207, productName: '05AM', quantity: 12 },
      { productId: 2142201, productName: '05PT', quantity: 1 },
      { productId: 2642206, productName: '06AM', quantity: 41 },
      { productId: 2652206, productName: '07PT', quantity: 41 },
      { productId: 2662206, productName: '10CD', quantity: 41 },
      { productId: 2672456 },
      { productId: 2672457 },
    ];

    datasource.data = dataset;
    datasource.sort('productName', true);

    expect(datasource.data[0].productName).toEqual('1');
    expect(datasource.data[1].productName).toEqual('10');
    expect(datasource.data[2].productName).toEqual('01AM');
    expect(datasource.data[9].productName).toEqual('07PT');
    expect(datasource.data[10].productName).toEqual('10CD');
    expect(datasource.data[11].productName).toBe(undefined);
    expect(datasource.data[12].productName).toBe(undefined);

    datasource.sort('productName', false);

    expect(datasource.data[0].productName).toEqual('10CD');
    expect(datasource.data[1].productName).toEqual('07PT');
    expect(datasource.data[2].productName).toEqual('06AM');
    expect(datasource.data[9].productName).toEqual('10');
    expect(datasource.data[10].productName).toEqual('1');
    expect(datasource.data[11].productName).toBe(undefined);
    expect(datasource.data[12].productName).toBe(undefined);
  });
});
