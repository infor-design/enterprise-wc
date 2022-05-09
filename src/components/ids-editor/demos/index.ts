// Supporting components
import '../ids-editor';
import '../../ids-radio/ids-radio';
import '../../ids-checkbox/ids-checkbox';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
