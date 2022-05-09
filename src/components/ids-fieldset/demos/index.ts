// Supporting components
import '../ids-fieldset';
import '../../ids-input/ids-input';
import '../../ids-button/ids-button';
import '../../ids-checkbox/ids-checkbox';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
