// Supporting components
import '../ids-hierarchy';
import '../ids-hierarchy-item';
import '../ids-hierarchy-legend';
import '../ids-hierarchy-legend-item';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
