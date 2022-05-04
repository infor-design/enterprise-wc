// Supporting components
import '../ids-calendar-event';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import calendarYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = calendarYaml.examples;
}
