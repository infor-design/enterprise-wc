// Supporting components
import '../ids-block-grid';
// @ts-ignore
import placeHolderImg from '../../../assets/images/placeholder-200x200.png';

const images = document.querySelectorAll('img');
images.forEach((img) => {
  img.src = placeHolderImg;
});
