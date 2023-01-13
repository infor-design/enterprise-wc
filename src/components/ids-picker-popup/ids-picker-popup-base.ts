import IdsAttachmentMixin from '../../mixins/ids-attachment-mixin/ids-attachment-mixin';
import IdsEventsMixin from '../../mixins/ids-events-mixin/ids-events-mixin';
import IdsFocusCaptureMixin from '../../mixins/ids-focus-capture-mixin/ids-focus-capture-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsFocusCaptureMixin(
  IdsPopupOpenEventsMixin(
    IdsPopupInteractionsMixin(
      IdsEventsMixin(
        IdsAttachmentMixin(
          IdsElement
        )
      )
    )
  )
);

export default Base;
