// Supporting components
import '../ids-expandable-area';
import '../../ids-input/ids-input';
import '../../ids-toggle-button/ids-toggle-button';
import '../../ids-icon/ids-icon';
import '../../ids-hyperlink/ids-hyperlink';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
