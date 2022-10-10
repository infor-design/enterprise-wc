import IdsAttachmentMixin from '../../mixins/ids-attachment-mixin/ids-attachment-mixin';
import IdsPopupOpenEventsMixin from '../../mixins/ids-popup-open-events-mixin/ids-popup-open-events-mixin';
import IdsPopupInteractionsMixin from '../../mixins/ids-popup-interactions-mixin/ids-popup-interactions-mixin';
import IdsLocaleMixin from '../../mixins/ids-locale-mixin/ids-locale-mixin';
import IdsElement from '../../core/ids-element';

const Base = IdsPopupOpenEventsMixin(
  IdsPopupInteractionsMixin(
    IdsAttachmentMixin(
      IdsLocaleMixin(
        IdsElement
      )
    )
  )
);

export default Base;
