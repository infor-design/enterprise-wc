import Base from './ids-message-base';

export default class IdsMessage extends Base {
  /** Sets the current status of the Message component */
  status?: 'none' | 'default' | 'error' | 'warn' | 'success' | 'info';

  /** Sets the inner HTML content of the Messsage component */
  message?: string;
}
