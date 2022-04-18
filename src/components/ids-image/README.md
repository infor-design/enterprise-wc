# Ids Image Component

## Description

The `ids-image` component is a web component wrapper around a standard `<img>` tag to handle image sizes, placeholders, thumbnails with statuses and user initials

## Use Cases
- Display an images with different sizes
- Display placeholder either from fallback or initially
- Display a thumbnail image with different statuses
- Display initials for the user

## Settings (Attributes)
- `src` `{string}` - Specifies the path to the image
- `alt` `{string}` - Specifies an alternate text for an image
- `size` `{auto|sm|md|lg}` - Specifies the size of the image, if no size is specified or size is not one of `auto|sm|md|lg` it defaults to `auto`
  - `sm` - 60x60px
  - `md` - 154x120px
  - `lg` - 300x350px
- `fallback` `{true|false}` - Whether or not to replace image with placeholder if the image fails to load
- `placeholder` `{true|false}` - Whether or not to use placeholder, if set, `src` and `alt` attributes will be ignored, image will not load and placeholder will be used initially
- `round` `{true|false}` - Whether or not to make the image round with 50x50x size
- `user-status` `{available|away|busy|do-not-disturb|unknown}` - Specifies whether or not to show status icon at the bottom right corner of the image and what type of icon
- `initials` `{string}` - Initials for the user, crops to two letters and uppercase automatically

## Features (With Code Examples)

Basic image behaves similarly to `<img>` tag in browser. Size is `auto` as default. Will show broken image if image fails to load

```html
<ids-image src="image.jpg" alt="image auto"></ids-image>
```

Basic image with fallback and size, broken image will be replaced with placeholder if image fails to load

```html
<ids-image src="image.jpg" alt="image md" size="md" fallback="true"></ids-image>
```

Placeholder initially with size md, src and alt attributes are ignored

```html
<ids-image placeholder="true" size="md"></ids-image>
```

Round image

```html
<ids-image src="image.jpg" alt="image round" round="true"></ids-image>
```

With status

```html
<ids-image src="image.jpg" alt="image round" round="true" user-status="available"></ids-image>
```

Initials

```html
<ids-image round="true" initials="mn"></ids-image>
```

The component can be controlled dynamically

```js
const image = document.querySelector('ids-image');

// Changing src and alt
image.src = 'another-image.jpg';
image.alt = 'changed alt';

// Using fallback in case the image with new src fails to load
image.fallback = true;
image.src = 'might-not-exist.jpg';

// Make it round
image.round = true;

// Add status icon
image.userStatus = 'available';

// Change to placeholder
image.src = null;

// Remove status icon
image.userStatus = null;

// Show initials
image.initials = 'mn';
```

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Block grid / Image List partially replaces the carousel in 3.x

**4.x to 5.x**

- Swipe Container replaces the carousel in 3.x
- Image List - can be done if needed with a toolbar and block grid
- The Image css for sizes/placeholder and alerts/initials has been changed to a web component with settings
- Markup has changed to a custom element `<ids-image></ids-image>` (see examples above)
- Can now be imported as a single JS file and used with encapsulated styles
