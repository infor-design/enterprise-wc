import { IdsElement } from '../ids-base';

export default class IdsSummaryForm extends IdsElement {
  /** Sets the data field of the summary form */
  data: string;

  /** Sets the font-weight of the data field of the summary form */
  fontWeight: 'bold' | '';

  /** Sets the label of the summary form */
  label: string;
}
