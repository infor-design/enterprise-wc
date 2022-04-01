// Supporting components
import '../ids-expandable-area';
import '../../ids-input/ids-input';
import '../../ids-toggle-button/ids-toggle-button';
import '../../ids-icon/ids-icon';
import '../../ids-hyperlink/ids-hyperlink';

document.addEventListener('DOMContentLoaded', () => {
  // Add an event listener to test clickable links
  document.querySelectorAll('ids-toggle-button').forEach((idsButton) => {
    idsButton.addEventListener('click', (e: any) => {
      e.target.toggle();
    });
  });
});
