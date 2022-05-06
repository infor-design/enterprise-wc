// Supporting components
import '../ids-breadcrumb';
import '../../ids-hyperlink/ids-hyperlink';
import '../../ids-button/ids-button';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
