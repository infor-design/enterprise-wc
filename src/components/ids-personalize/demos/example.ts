import '../../ids-color-picker/ids-color-picker';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-header/ids-header';
import '../../ids-hyperlink/ids-hyperlink';
import '../../ids-menu-button/ids-menu-button';
import '../../ids-progress-bar/ids-progress-bar';
import '../../ids-search-field/ids-search-field';
import '../../ids-slider/ids-slider';
import '../../ids-tabs/ids-tabs';
import '../../ids-tabs/ids-tabs-context';
import '../../ids-tag/ids-tag';
import '../../ids-toolbar/ids-toolbar';
import IdsPersonalization from '../ids-personalize';

// Handle Theme Picker Changes
const primaryColor = (document as any).querySelector('#pers-color');
const updateColors = () => {
  const personalize = new IdsPersonalization();
  const colors = personalize.colorProgression(primaryColor.value);
  personalize.color = primaryColor.value;

  document.querySelector('#color-10')?.setAttribute('hex', colors.primary10);
  document.querySelector('#color-20')?.setAttribute('hex', colors.primary20);
  document.querySelector('#color-30')?.setAttribute('hex', colors.primary30);
  document.querySelector('#color-40')?.setAttribute('hex', colors.primary40);
  document.querySelector('#color-50')?.setAttribute('hex', colors.primary50);
  document.querySelector('#color-60')?.setAttribute('hex', colors.primary60);
  document.querySelector('#color-70')?.setAttribute('hex', colors.primary70);
  document.querySelector('#color-80')?.setAttribute('hex', colors.primary80);
  document.querySelector('#color-90')?.setAttribute('hex', colors.primary90);
  document.querySelector('#color-100')?.setAttribute('hex', colors.primary100);
};

// Update Styles
document.querySelectorAll('ids-color-picker').forEach((picker) => {
  picker.addEventListener('change', () => {
    updateColors();
  });
});
