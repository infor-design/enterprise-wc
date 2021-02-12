// Ids is a JavaScript project, but we define TypeScript declarations so we can
// confirm our code is type safe, and to support TypeScript users.

export class IdsKeyboardMixin {
  /** The map containing all keys mapped for the component */
  hotkeys: Map<unknown, unknown>;

  /** The map containing all current down pressed keys */
  pressedKeys: Map<unknown, unknown>;

  /** Add a listener for a key or key code combination */
  listen(keycode: Array<unknown> | string, elem: HTMLElement, callback: () => void): void;

  /** Remove all handlers and clear memory */
  detachAllKeyboard(): void;
}
