import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsFocusCaptureMixin from '../../mixins/ids-focus-capture-mixin/ids-focus-capture-mixin';
import IdsKeyboardMixin from '../../mixins/ids-keyboard-mixin/ids-keyboard-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsThemeMixin from '../../mixins/ids-theme-mixin/ids-theme-mixin';
import IdsXssMixin from '../../mixins/ids-xss-mixin/ids-xss-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsXssMixin(
  IdsFocusCaptureMixin(
    IdsKeyboardMixin(
      IdsPopupInteractionsMixin(
        IdsPopupOpenEventsMixin(
          IdsThemeMixin(
            IdsEventsMixin(
              IdsElement
            )
          )
        )
      )
    )
  )
);

export default Base;
