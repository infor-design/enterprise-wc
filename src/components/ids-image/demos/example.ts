import IdsImg10 from '../../../assets/images/10.jpg';

document.addEventListener('DOMContentLoaded', () => {
  const idsImgClass11 = window.document.getElementsByClassName('ids-img-10');
  [...idsImgClass11].forEach((element: any) => {
    element.src = IdsImg10;
  });
});
