// Imports Used in the Examples
import pathData from 'ids-identity/dist/theme-new/icons/standard/path-data.json';
import emptyIconPathData from 'ids-identity/dist/theme-new/icons/empty/path-data.json';

// Here we append all the HTML to show off the icons to the icon div section
const queryString = window.location.search;
const justOne = queryString === '?count=1';

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.ids-icon-list');
  const emptySection = document.querySelector('.ids-empty-icon-list');
  let iconHtml = '';
  let emptyIconHtml = '';
  const iconData = Object.entries(pathData);
  const emptyIconData = Object.entries(emptyIconPathData);

  for (let i = 0; i < iconData.length; i++) {
    iconHtml += `<span class="ids-icon-container"><ids-text font-size="10">icon-${iconData[i][0]}</ids-text><br/>
      <ids-icon icon="${iconData[i][0]}" size="large"></ids-icon>
      <ids-icon icon="${iconData[i][0]}"></ids-icon>
      <ids-icon icon="${iconData[i][0]}" size="xsmall"></ids-icon></span>`;

    if (i === 0 && justOne) {
      break;
    }
  }

  for (let i = 0; i < emptyIconData.length; i++) {
    emptyIconHtml += `<span class="ids-icon-container"><ids-text font-size="10">icon-${emptyIconData[i][0]}</ids-text><br/>
    <ids-icon icon="${emptyIconData[i][0]}" height="80" viewbox="0 0 80 80" width="80"></ids-icon></span>`;
  }

  if (section) {
    section.insertAdjacentHTML('beforeend', iconHtml);
  }
  if (emptySection) {
    emptySection.insertAdjacentHTML('beforeend', emptyIconHtml);
  }
});
