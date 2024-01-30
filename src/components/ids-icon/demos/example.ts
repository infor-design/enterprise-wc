// Supporting components
import pathData from 'ids-identity/dist/theme-new/icons/default/path-data.json';
import emptyIconPathData from 'ids-identity/dist/theme-new/icons/old/empty/path-data.json';

// Here we append all the HTML to show off the icons to the icon div section
const queryString = window.location.search;
const justOne = queryString === '?count=1';

document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('.ids-icon-list');
  const emptySection = document.querySelector('.ids-empty-icon-list');
  const emptySection150 = document.querySelector('.ids-empty-icon-list-150');
  const emptySection300 = document.querySelector('.ids-empty-icon-list-300');
  const emptySection500 = document.querySelector('.ids-empty-icon-list-500');
  let iconHtml = '';
  let emptyIconHtml = '';
  let emptyIconHtml150 = '';
  let emptyIconHtml300 = '';
  let emptyIconHtml500 = '';
  const iconData = Object.entries(pathData);
  const emptyIconData = Object.entries(emptyIconPathData);

  for (let i = 0; i < iconData.length; i++) {
    iconHtml += `<span class="ids-icon-container"><ids-text font-size="10">icon-${iconData[i][0]}</ids-text><br/>
      <ids-icon icon="${iconData[i][0]}" ${(iconData[i][0] === 'logo' || iconData[i][0] === 'logo-trademark') ? 'viewbox="0 0 35 34"' : ''} size="large"></ids-icon>
      <ids-icon icon="${iconData[i][0]}" ${(iconData[i][0] === 'logo' || iconData[i][0] === 'logo-trademark') ? 'viewbox="0 0 35 34"' : ''} ></ids-icon>
      <ids-icon icon="${iconData[i][0]}" ${(iconData[i][0] === 'logo' || iconData[i][0] === 'logo-trademark') ? 'viewbox="0 0 35 34"' : ''} size="small"></ids-icon></span>`;

    if (i === 0 && justOne) {
      break;
    }
  }

  for (let i = 0; i < emptyIconData.length; i++) {
    const name = emptyIconData[i][0];
    let width = '80';
    const lastThree = name.slice(-3);
    if (lastThree === '150') {
      width = '150';
      emptyIconHtml150 += `<span class="ids-icon-container"><ids-text font-size="10">icon-${name}</ids-text><br/>
      <ids-icon icon="${name}" height="${width}" viewbox="0 0 ${width} ${width}" width="${width}"></ids-icon></span>`;
    } else if (lastThree === '300') {
      width = '300';
      emptyIconHtml300 += `<span class="ids-icon-container"><ids-text font-size="10">icon-${name}</ids-text><br/>
      <ids-icon icon="${name}" height="${width}" viewbox="0 0 ${width} ${width}" width="${width}"></ids-icon></span>`;
    } else if (name === 'service-unavailable') {
      width = '500';
      emptyIconHtml500 += `<span class="ids-icon-container"><ids-text font-size="10">icon-${name}</ids-text><br/>
      <ids-icon icon="${name}" height="${width}" viewbox="0 0 ${width} ${width}" width="${width}"></ids-icon></span>`;
    } else {
      emptyIconHtml += `<span class="ids-icon-container"><ids-text font-size="10">icon-${name}</ids-text><br/>
      <ids-icon icon="${name}" height="${width}" viewbox="0 0 ${width} ${width}" width="${width}"></ids-icon></span>`;
    }
  }

  if (section) {
    section.insertAdjacentHTML('beforeend', iconHtml);
  }
  if (emptySection) {
    emptySection.insertAdjacentHTML('beforeend', emptyIconHtml);
  }
  if (emptySection150) {
    emptySection150.insertAdjacentHTML('beforeend', emptyIconHtml150);
  }
  if (emptySection300) {
    emptySection300.insertAdjacentHTML('beforeend', emptyIconHtml300);
  }
  if (emptySection500) {
    emptySection500.insertAdjacentHTML('beforeend', emptyIconHtml500);
  }
});
