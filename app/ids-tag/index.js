// Import all the components used in the index
import IdsTag from '../../src/ids-tag/ids-tag';
import '../../src/ids-tag/ids-tag.scss';

// Establish the Custom Elements
window.onload = () => {
  customElements.define('ids-tag', IdsTag);
};
