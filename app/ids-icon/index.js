// Imports Used in the Examples
import pathData from 'ids-identity/dist/theme-uplift/icons/standard/path-data.json';
import IdsIcon from '../../src/ids-icon/ids-icon';
import IdsTag from '../../src/ids-tag/ids-tag';
import IdsLayoutGrid from '../../src/ids-layout-grid/ids-layout-grid';
import IdsLayoutColumn from '../../src/ids-layout-grid/ids-layout-column';

// Example Code used in the examples

// Here we append all the HTML to show off the icons to the icon div section
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.ids-icon-list');
  let iconHtml = '';
  Object.entries(pathData).map((x) => {
    iconHtml += `<span class="ids-grid-wrap"><span class="ids-label ids-text-px-10">icon-${x[0]}</span><br/>
      <ids-icon icon="${x[0]}" compactness="wide"></ids-icon>
      <ids-icon icon="${x[0]}"></ids-icon>
      <ids-icon icon="${x[0]}" compactness="condensed"></ids-icon></span>`;
    return x;
  });
  section.insertAdjacentHTML('beforeend', iconHtml);
});
