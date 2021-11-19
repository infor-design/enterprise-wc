import Base from './ids-progress-bar-base';

interface IdsProgressEventDetail extends Event {
  detail: {
    elem: IdsProgressBar
  }
}

export default class IdsProgressBar extends Base {
  /** Sets to disabled * */
  disabled: boolean;

  /** Sets the input label text * */
  label: string;

  /** Sets the input label text as audible * */
  labelAudible: boolean;

  /** Sets the max attribute * */
  max: string | number;

  /** Sets the `value` attribute * */
  value: string | number;

  /** Fires after updated the progress value */
  on(event: 'updated', listener: (detail: IdsProgressEventDetail) => void): this;
}
