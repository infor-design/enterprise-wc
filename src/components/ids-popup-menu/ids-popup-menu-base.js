import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsMenu from '../ids-menu/ids-menu';
import IdsPopupInteractionsMixin from "../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin";
import IdsPopupOpenEventsMixin from "../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin";

const Base = IdsEventsMixin(
  IdsPopupInteractionsMixin(
    IdsPopupOpenEventsMixin(
      IdsMenu
    )
  )
)

export default Base;
