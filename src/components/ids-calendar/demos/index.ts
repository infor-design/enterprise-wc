import '../ids-calendar';
import '../../ids-accordion/ids-accordion';
import '../../ids-week-view/ids-week-view';
import '../../ids-month-view/ids-month-view';
import '../../ids-checkbox/ids-checkbox';
import '../../ids-data-label/ids-data-label';
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
