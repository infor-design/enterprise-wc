// Supporting components
import IdsImage from '../ids-image';
import IdsImg10 from '../../../assets/images/10.jpg';
import placeHolderImg6060 from '../../../assets/images/placeholder-60x60.png';
import placeHolder154120Img from '../../../assets/images/placeholder-154x120.png';

const idsImgClass10 = window.document.getElementsByClassName('ids-img-10');
[...idsImgClass10].forEach(element => element.src = IdsImg10);

const IdsImgClass6060 = window.document.getElementsByClassName('placeholder-60-60')[0];
IdsImgClass6060.src = placeHolderImg6060;

const placeHolder154120 = window.document.getElementsByClassName('placeholder-154-120')[0];
placeHolder154120.src = placeHolder154120Img;