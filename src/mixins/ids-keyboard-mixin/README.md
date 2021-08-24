## Ids Keyboard Mixin

- Handles detaching if a key is pressed down currently
- Adds a hot key mapper
- Can list the supported keys for a component

The Keyboard mixin is attached with the `mix ... with` decorator. To use it to respond to keys in a component you can use it like this:

```js
handleKeys() {
    this.listen('Enter', this, (e) => {
        // Do something on Enter
    });
}
```

Also at any time you can check `this.pressedKeys` to see what keys are current down. `this.hotkeys` contains all the currently watched keys.
