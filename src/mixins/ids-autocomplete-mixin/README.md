## Ids Autocomplete Mixin

This mixin adds typeahead/autocomplete functionality to the `ids-input` component. IdsAutocompleteMixin is imported into the IdsInput mixin list.

### Attributes

* `autocomplete` can be set to true to enable autocomplete functionality
* `data` a instance of [IdsDatasource](../../core/README.md)]
* `search-key` can be set to a string of the the field to be searched in the dataset.

### Example
```html
    <ids-input
        id="input-autocomplete"
        placeholder="This input's label is visible"
        size="md"
        label="Autocomplete Input"
        autocomplete
        search-key="label"
    >
    </ids-input>
```

```js
import statesJSON from '../../../assets/data/states.json';

const input = document.querySelector('#input-autocomplete');

const setData = async () => {
  const res = await fetch(statesJSON);
  const data = await res.json();
  input.data = data;
};

setData();
```
