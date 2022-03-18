import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsMenu from '../ids-menu/ids-menu';

const Base = IdsPopupOpenEventsMixin(
  IdsPopupInteractionsMixin(
    IdsLocaleMixin(
      IdsEventsMixin(
        IdsMenu
      )
    )
  )
);

export default Base;
