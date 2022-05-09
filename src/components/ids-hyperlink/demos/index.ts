// Supporting components
import '../ids-hyperlink';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
