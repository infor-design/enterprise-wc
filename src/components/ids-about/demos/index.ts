// Supporting components
import '../../ids-button/ids-button';
import '../ids-about';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import aboutYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = aboutYaml.examples;
}
