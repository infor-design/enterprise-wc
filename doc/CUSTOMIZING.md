# Customizing IDS Web Components

IDS Web Components are designed according to IDS Guidelines. The latest version includes the newest default design out of the box and should blend well in any Infor Application or Application in general. We also provide a lot of options for customization within each component, so check the component docs for the various settings. However, we also have a few ways to customize the look and behavior of
components to further assist with your application's needs. This page outlines the ways you can customize the components beyond the built in look and settings.

## Slots

Many components have either a default slot or a named slot. For more info on slots see [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot). You can fill either the default slot or named slots with other elements.

For example using the default slot you could add more content inside it.

```html
<ids-text font-size="16">Settings <ids-icon icon="settings"></ids-icon></ids-text>
```

For example using the named slot you could add more content inside it. Like an icon in the accordion header. You may need css to lay this out but could use `ids-layout-grid` or `ids-layout-flex` to do some layout.

```html
<ids-accordion-header slot="header">
  <ids-text font-size="16">Settings <ids-icon icon="settings"></ids-icon></ids-text>
</ids-accordion-header>
```

## Styling Css Shadow Parts

Each component exposes a range of [CSS Shadow Parts](https://developer.mozilla.org/en-US/docs/Web/CSS/::part) (see the readme.md or code header for each component). For example the [tooltip component](https://github.com/infor-design/enterprise-wc/blob/main/src/components/ids-tooltip/ids-tooltip.ts#L76) exposes the main internal panel that gives you a way to style it externally. Keep in mind our components have full css encapsulation so this is one additional way. If you find a place where a `::part` is needed feel free to make an issue or pull request.

You can target this shadow part with a css selector like this using the tooltip ID and the `::part`.

```css
ids-tooltip[target='#tooltip-parts']::part(tooltip) {
  font-weight: 300;
  text-transform: capitalize;
}
```

## Extending Component Classes

Since our code base is Typescript it is possible to full extend any component and add additional functionality. The basic idea is is..

```js
import IdsCalendarEvent from '../node_modules/ids-enterprise/components/ids-calendar/ids-calendar-event';

export default class IdsCustomCalendarEvent extends IdsCalendarEvent {
 ...
}
```

Once you do this you can then override or add any methods. Such as the `template` which will let you fully change the markup. You can also append a style sheet into the shadow root or do any overrides.

This technique is flexible but susceptible to problems or needing updates as we make future updates or changes to the internals.

## Reusing Mixins

Another possibility is to reuse some of the "sub-functionality" of our components. We tried to create a series of reusable "mixins" that add functionality. For a list of mixins see [src/mixins](https://github.com/infor-design/enterprise-wc/tree/main/src/mixins). For example you could use the tooltip mixin to add a tooltip option to your custom component or the chart legend mixin to add a legend to your own chart in the matching style.

## Theming

Each of the components has a considerable number of customizable css variables you can customize to various degrees to accomplish themes or small overrides. The default theme is called `default` and it is injected the first time you add a custom web component to the page. If you add a style sheet after the title element in the head it will take precedence. See `src/themes/default/ids-theme-default-core.scss` for a full list of css variables or look at the component css.

As an example for customizing the header color, and text colors you could do something like:

```css
--ids-color-primary: var(--ids-color-azure-70);
--ids-color-text: var(--ids-color-neutral-100);
--ids-input-color-background-default: var(--ids-color-neutral-00);
--ids-input-color-border-default: var(--ids-color-neutral-100);
```

Using this technique one can customize everything from a simple primary color change to an entire new theme for a customer or future themes. We may not have got every component fully them-able the first go so make a request to add any further tokens to the components.

Built in themes can be set on the `ids-theme-switcher` component by setting the theme property for example `theme="default-light"` or `theme="default-dark"`. The `mode` property will also work (sets it `default-dark`). A theme is constructed of three parts: Visual Identity -> Modes -> Personalization Color. The whole thing is considered a `theme` you can change any of the parts at these levels.

To set just a personalization color you just have to change the primary color variable.

```css
--ids-color-primary: #800;
```

To create a full theme take all the variables in `src/themes/default/ids-theme-default-core.scss` and change the ones you need to create the theme. You only need to include the one you changed. For a non customer theme (Infor based) its recommended you always you the current palette colors as per `ids-color/demos/palette.html`. But note that you can change the entire palette if desired although this is current work in progress due to the need for further refinement.

You can include the initial theme one of two ways.

1. Let the components manage the styles in head manually
2. If you need to serve the css files in a different way you can include the theme manually as a link. Then the theme switcher will replace the file name section when you use it. Or you could full manage this yourself (replacing the theme file changes theme). For example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="/my-place/themes/ids-theme-default-light.css">
</head>
<body>
```
