# Components

## Adding a new component from scratch

### Scaffold the component source code

- [ ] Create a folder `/src/ids-[component]`, which will contain all your new component source code.
- [ ] Add an `ids-[component].js`, which is the WebComponent interaction code.
- [ ] Add an `ids-[component].d.ts` for this WebComponent's TypeScript defs.
- [ ] Add an `ids-[component].scss`, which holds all scoped styles for this WebComponent.
- [ ] Add a `README.md` for documentation, specificiation, etc.

Some important steps here include:

- If this new code is an IDS Component, ensure that it imports `src/ids-base/ids-element.js` extends the `IdsElement` base component.
- Ensure that your styles are imported in `ids-[component].js` and added to the component via the `@scss` decorator.
- Review the mixins that are available in the `src/ids-base` folder for any reusable parts.

### Add a new app example for the new component

- [ ] Add an `example.html`, which contains the basic example template for your component
- [ ] Add an `index.html`, which is the main layout template
- [ ] Add an `index.js` for loading components

After these files are created, do the following:

- [ ] In `index.js`, import the WebComponent's source file that you've created using a relative path.

```js
import IdsComponent from '../../src/ids-[component]/ids-[component]';
```

- [ ] `index.html` will contain the contents of `example.html` but also includes the dev server's header and footer partials.  It looks like the following:

```handlebars
{{> ../layouts/head.html }}
{{> example.html }}
{{> ../layouts/footer.html }}
```

### Add new information to `webpack.config.js`

The Entry and HTMLWebPack element are now auto added and picked up on script load. You mean need to restart the server or use `npm run start:watch`
