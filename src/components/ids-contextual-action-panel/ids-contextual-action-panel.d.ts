import Base from './ids-contextual-action-pane-base';
import IdsToolbar from '../ids-toolbar/ids-toolbar';

export default class IdsContextualActionPanel extends Base {
  /** Optional Toolbar that will appear in the Contextul Action Panel header */
  readonly toolbar?: IdsToolbar;
}
