export default class IdsMessage extends HTMLElement {
  /** Sets the current status of the Message component */
  status?: 'none' | 'default' | 'success' | 'info' | 'warning' | 'error';

  /** Sets the inner HTML content of the Messsage component */
  message?: string;
}
