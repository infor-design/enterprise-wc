import Base from './ids-treemap-base';

export default class IdsTreeMap extends Base {
  /** Sets the data object of the treemap */
  data?: object | [{ value: 1 }, { value: 2 }];

  /** Sets the title the treemap */
  title: string;
}
