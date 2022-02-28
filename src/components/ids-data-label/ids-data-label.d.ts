export default class IdsDataLabel extends HTMLElement {
  /* Types of alert */
  labelPosition: 'top' | 'left';

  /* Set alert to disabled */
  label: string;

  /** Set the theme mode */
  mode: 'light' | 'dark' | 'contrast' | string;
}
