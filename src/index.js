import IdsIcon from './ids-icon/ids-icon';
import IdsTag from './ids-tag/ids-tag';
import './ids-tag/ids-tag.scss';

window.onload = () => {
  customElements.define('ids-icon', IdsIcon);
  customElements.define('ids-tag', IdsTag);
};
