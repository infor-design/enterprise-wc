/**
 * @jest-environment jsdom
 */
import { IdsDeepCloneMixin as cloneUtils } from '../../src/ids-base/ids-deep-clone-mixin';

describe('IdsDeepCloneMixin Tests', () => {
  it('can clone a plain array', () => {
    expect(cloneUtils.deepClone([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('can clone a string / non object', () => {
    expect(cloneUtils.deepClone('test')).toEqual('test');
    expect(cloneUtils.deepClone(null)).toEqual(null);
  });

  it('can clone a date', () => {
    const d1 = new Date();
    const d2 = new Date();
    expect(cloneUtils.deepClone(d1).getTime()).toEqual(d2.getTime());
  });

  it('can clone a plain object', () => {
    const original = { prop1: 1, prop2: 2 };
    const clone = cloneUtils.deepClone(original);
    original.prop1 = 3;
    original.prop2 = 4;

    expect(clone.prop1).toEqual(1);
    expect(clone.prop2).toEqual(2);
  });

  it('can clone an arrays in an object', () => {
    const original = { x: 1, triggers: ['1', '2'] };
    const clone = cloneUtils.deepClone(original);
    original.triggers = [4, 5];

    expect(clone.triggers[0]).toEqual('1');
    expect(clone.triggers[1]).toEqual('2');
  });

  it('can clone an array of objects', () => {
    const original = [{ test1: '1', test2: '1' }, { test1: '2', test2: '2' }];
    const clone = cloneUtils.deepClone(original);
    original[0] = { test1: '2', test2: '2' };
    original[1] = { test1: '3', test2: '3' };

    expect(clone[0]).toEqual({ test1: '1', test2: '1' });
    expect(clone[1]).toEqual({ test1: '2', test2: '2' });
  });

  it('can skip prototype properties', () => {
    const Person = function Person(name) {
      this.name = name;
    };
    Person.prototype.age = 43;
    const original = new Person('Bill');

    const clone = cloneUtils.deepClone(original);
    expect(clone.age).toEqual(undefined);
    expect(clone.name).toEqual('Bill');
  });

  it('can clone an array of date objects', () => {
    const d1 = new Date();
    const d2 = new Date();

    const original = [{ test1: d1, test2: '1' }, { test1: d1, test2: '2' }];
    const clone = cloneUtils.deepClone(original);
    original[0] = { test1: new Date(10, 10, 2020), test2: '2' };
    original[1] = { test1: new Date(10, 10, 2020), test2: '3' };

    expect(clone[0].test1.getTime()).toEqual(d1.getTime());
    expect(clone[1].test1.getTime()).toEqual(d1.getTime());
  });

  it('can clone an array of date objects', () => {
    const d1 = new Date();
    const d2 = new Date();

    const original = [d1, d2];
    const clone = cloneUtils.deepClone(original);
    original[0] = [new Date(10, 10, 2020), new Date(10, 10, 2020)];
    original[1] = [new Date(10, 10, 2020), new Date(10, 10, 2020)];

    expect(clone[0].getTime()).toEqual(d1.getTime());
    expect(clone[1].getTime()).toEqual(d2.getTime());
  });

  it('can clone an object with circular refs', () => {
    const original = { okProp: true };
    original.circularReference = original;

    const clone = cloneUtils.deepClone(original);

    expect(clone.okProp).toEqual(true);
    expect(clone.circularReference).toEqual(original);
  });

  it('can clone an array with circular refs', () => {
    const original = { nestedThing: [1, 2] };
    original.nestedThing.push(original);

    const clone = cloneUtils.deepClone(original);

    expect(clone.nestedThing[0]).toEqual(1);
    expect(clone.nestedThing[1]).toEqual(2);
  });
});
