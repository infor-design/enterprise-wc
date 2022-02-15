// Supporting components
import IdsExpandableArea from '../ids-expandable-area';
import IdsInput from '../../ids-input/ids-input';
import IdsToggleButton from '../../ids-toggle-button/ids-toggle-button';
import IdsIcon from '../../ids-icon/ids-icon';
import IdsHyperLink from '../../ids-hyperlink/ids-hyperlink';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e) => {
      e.target.toggle();
    });
  });
});
