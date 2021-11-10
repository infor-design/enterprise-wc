import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsEventsMixin(
  IdsKeyboardMixin(
    IdsElement
  )
)

export default Base;
