// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export default class IdsText extends HTMLElement {
  /** Set the pressed (on/off) state */
  pressed: boolean|string;
  /** Defines the `unpressed/off` toggle state icon. */
  iconOff: string;
  /** Defines the `unpressed/off` toggle state icon. */
  iconOn: string;
  /** Defines the `unpressed/off` toggle state text. */
  textOff: string;
  /** Defines the `unpressed/off` toggle state text. */
  textOn: string;
}
