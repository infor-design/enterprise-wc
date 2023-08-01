import IdsElement from '../../core/ids-element';
import { stringToBool } from '../ids-string-utils/ids-string-utils';

export const setBooleanAttr = (name: string, el: IdsElement, value: boolean | string) => {
  const isTruthy = stringToBool(value);
  if (isTruthy) {
    el.setAttribute(name, `${isTruthy}`);
    el.container?.classList.add(name);
  } else {
    el.removeAttribute(name);
    el.container?.classList.remove(name);
  }
};
