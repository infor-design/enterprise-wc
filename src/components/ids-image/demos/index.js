// Supporting components
import IdsImage from '../ids-image';
import IdsImg10 from '../../../assets/images/10.jpg';
import placeHolderImg6060 from '../../../assets/images/placeholder-60x60.png';
import placeHolderImg154120 from '../../../assets/images/placeholder-154x120.png';
import placeHolderImg300350 from '../../../assets/images/placeholder-300x350.png';

const idsImgClass10 = window.document.getElementsByClassName('ids-img-10');
[...idsImgClass10].forEach(element => element.src = IdsImg10);

const IdsImgClass6060 = window.document.getElementsByClassName('placeholder-60-60')[0];
IdsImgClass6060.src = placeHolderImg6060;

const placeHolderClass154120 = window.document.getElementsByClassName('placeholder-154-120')[0];
placeHolderClass154120.src = placeHolderImg154120;

const placeHolderClass300350 = window.document.getElementsByClassName('placeholder-300-350')[0];
placeHolderClass300350.src = placeHolderImg300350;
