import IdsModal from '../ids-modal';
import IdsToolbar from '../ids-toolbar';

export default class IdsContextualActionPanel extends IdsModal {
  /** Optional Toolbar that will appear in the Contextul Action Panel header */
  readonly toolbar?: IdsToolbar;
}
