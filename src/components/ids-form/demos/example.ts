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

(document.querySelector('#sample-form') as any).addEventListener('submit', (e: CustomEvent) => {
  console.info(`Form Submitted`, e.detail);
});
