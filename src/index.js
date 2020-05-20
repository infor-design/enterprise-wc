// Import all the compoents used in the index
import IdsIcon from './ids-icon/ids-icon';
import IdsTag from './ids-tag/ids-tag';
import './ids-tag/ids-tag.scss';

// Establish the Custom Elements on Load
window.onload = () => {
  customElements.define('ids-icon', IdsIcon);
  customElements.define('ids-tag', IdsTag);
};
