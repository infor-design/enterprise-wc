import IdsModal from '../ids-modal';

export default class IdsMessage extends IdsModal {
  /** Sets the current status of the Message component */
  status?: 'none' | 'default' | 'error' | 'warn' | 'success' | 'info';

  /** Sets the inner HTML content of the Messsage component */
  message?: string;
}
