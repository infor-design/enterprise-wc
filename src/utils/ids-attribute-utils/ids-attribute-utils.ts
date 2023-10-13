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

export const setSizeAttr = (name: string, el: IdsElement, value: string | null) => {
  if (value) {
    el.setAttribute(name, value.toString());
    el.container?.classList.add(`has-${name}`);
  } else {
    el.removeAttribute(name);
    el.container?.classList.remove(`has-${name}`);
  }
};
