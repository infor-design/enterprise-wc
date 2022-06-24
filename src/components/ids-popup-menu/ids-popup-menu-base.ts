import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsMenu from '../ids-menu/ids-menu';

const Base = IdsPopupOpenEventsMixin(
  IdsPopupInteractionsMixin(
    IdsMenu
  )
);

export default Base;
