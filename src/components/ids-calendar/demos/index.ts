import '../ids-calendar';
import '../../ids-accordion/ids-accordion';
import '../../ids-week-view/ids-week-view';
import '../../ids-month-view/ids-month-view';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-data-label/ids-data-label';
import '../../ids-popup/ids-popup';
import '../../ids-input/ids-input';
import '../../ids-date-picker/ids-date-picker';
import '../../ids-dropdown/ids-dropdown';
import '../../ids-list-box/ids-list-box';
import '../../ids-time-picker/ids-time-picker';
import '../../ids-textarea/ids-textarea';
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
