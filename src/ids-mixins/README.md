## Ids Mixins

Mixins are simply functions with shared functionality that can be injected into a component. For example the IdsEventOmitter. They get around the issue that in JS that you cannot inherit from more than one object. Also they prevent the Base Element from getting bloated with functionality that not every component uses. Ids is using a simple object as a mixin that in "injected" into the component in the constructor and then used according to its documentation. If the mixin has UI elements it should probably be a web component instead.
