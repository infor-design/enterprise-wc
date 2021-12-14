import { IdsElement } from '../../core';

export default class IdsErrorPage extends IdsElement {
  /* id of the icon to be displayed */
  icon: string;

  /* label of te error page to be displayed */
  label: string;

  /* description of the error page to be displayed */
  description: string;

  /* button text of the action button to be displayed (default: "Action") */
  buttonText: string | 'Action';
}
