# Ids Deep Clone Utils

This mixin makes a deep copy of an array or object even if its nested, or contains functions. Its optimized to be very fast. In addition it can handle circular references and objects and arrays. It is used in the data source mixin.

```js
const newArray = IdsDeepCloneUtils.deepClone(originalArray);
```
