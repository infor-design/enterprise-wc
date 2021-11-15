import IdsEventsMixin from "../../mixins/ids-events-mixin/ids-events-mixin";
import IdsKeyboardMixin from "../../mixins/ids-keyboard-mixin/ids-keyboard-mixin";
import IdsAttributeProviderMixin from '../../mixins/ids-attribute-provider-mixin/ids-attribute-provider-mixin';
import IdsElement from "../../core/ids-element";

const Base = IdsEventsMixin(
  IdsKeyboardMixin(
    IdsAttributeProviderMixin(
      IdsElement
    )
  )
)

export default Base
