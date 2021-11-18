import Base from './ids-action-sheet-base';

export default class extends Base {
  /** True if the Action sheet should be displayed */
  visible: boolean;

  /** Sets the inner text of the cancel btn */
  btnText: string;
}
