import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsEventsMixin(
  IdsPopupOpenEventsMixin(
    IdsElement
  )
)

export default Base;
