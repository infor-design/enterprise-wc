import '../../ids-button/ids-button';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-textarea/ids-textarea';
import '../../ids-color-picker/ids-color-picker';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-lookup/ids-lookup';
import '../../ids-radio/ids-radio';
import '../../ids-search-field/ids-search-field';
import '../../ids-spinbox/ids-spinbox';
import '../../ids-switch/ids-switch';
import '../../ids-time-picker/ids-time-picker';
import '../../ids-upload/ids-upload';
import '../../ids-multiselect/ids-multiselect';

const form = (document.querySelector('#sample-form') as any);
const toggleCompactBtn = (document.querySelector('#btn-toggle-compact') as any);

form.addEventListener('submit', (e: CustomEvent) => {
  form.checkValidation();
  console.info(`Form Submitted`, e.detail, form.isValid);
});

toggleCompactBtn?.addEventListener('click', () => {
  form?.setAttribute('compact', !form?.compact);
});

document.querySelector('ids-multiselect')?.addEventListener('change', (e) => {
  console.info(`Multiselect change event fired`, (e.target as any).value);
});
document.querySelector('ids-multiselect')?.addEventListener('input', (e) => {
  console.info(`Multiselect input event fired`, (e.target as any).value);
});
