// Supporting components
import '../ids-app-menu';
import '../../ids-block-grid/ids-block-grid';
import '../../ids-card/ids-card';
import '../../ids-button/ids-button';
import '../../ids-icon/ids-icon';
import '../../ids-search-field/ids-search-field';
import '../../ids-toolbar/ids-toolbar';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}
