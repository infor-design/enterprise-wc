// Supporting components
import '../ids-block-grid';
import placeHolderImg from '../../../assets/images/placeholder-200x200.png';

// Listing Page
import '../../ids-demo-app/ids-demo-listing';
import indexYaml from './index.yaml';

const demoListing: any = document.querySelector('ids-demo-listing');
if (demoListing) {
  demoListing.data = indexYaml.examples;
}

// Images
const images = document.querySelectorAll('img');
images.forEach((img) => {
  img.src = placeHolderImg;
});
