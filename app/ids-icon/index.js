// Imports Used in the Examples
import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import IdsIcon from '../../src/ids-icon/ids-icon';

// Here we append all the HTML to show off the icons to the icon div section
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.ids-icon-list');
  let iconHtml = '';
  Object.entries(pathData).map((x) => {
    iconHtml += `<span class="ids-icon-container"><ids-label font-size="10">icon-${x[0]}</ids-label><br/>
      <ids-icon icon="${x[0]}" size="large"></ids-icon>
      <ids-icon icon="${x[0]}"></ids-icon>
      <ids-icon icon="${x[0]}" size="small"></ids-icon></span>`;
    return x;
  });

  if (section) {
    section.insertAdjacentHTML('beforeend', iconHtml);
  }
});
