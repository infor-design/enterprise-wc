// Supporting components
import '../ids-alert';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import alertYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = alertYaml.examples;
}
