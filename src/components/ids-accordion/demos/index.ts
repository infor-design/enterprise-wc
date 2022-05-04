// Supporting components
import '../ids-accordion';
import '../../ids-icon/ids-icon';
import '../../ids-block-grid/ids-block-grid';
import '../../ids-card/ids-card';
import '../../ids-layout-grid/ids-layout-grid';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import accordionYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = accordionYaml.examples;
}
