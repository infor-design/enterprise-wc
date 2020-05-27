// Import all the components used in the index
import IdsIcon from '../src/ids-icon/ids-icon';
import IdsTag from '../src/ids-tag/ids-tag';
import '../src/ids-tag/ids-tag.scss';

// Establish the Custom Elements on Load TODO: BASE
window.onload = () => {
  customElements.define('ids-icon', IdsIcon);
  customElements.define('ids-tag', IdsTag);
};
