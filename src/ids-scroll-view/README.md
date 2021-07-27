# Ids Scroll View Component

## Description

The scroll view component allows swipe and scroll in between a number of slides/tabs or pages. The user can click the circle buttons or swipe left or right to activate adjacent page/slide/tabs. This component is roughly similar to the previous "Circle Pager". Its also similar to a "Carousel".

## Use Cases

- Use when a user is primarily a mobile user and they need to flip through a set of related objects or pages.
- Do Not Use as a dumping ground for content or for primary / main interaction

## Terminology

- **Circle Pager**: The older 4.x name for his component
- **Carousel**: Another name for this sort of component with slides and buttons

## Features (With Code Examples)

A scrollview with images. You just need to add each element to the scroll view. Each of the immediate children should get `slot="scroll-view-item"`. If using images the `alt` tag is very important for accessibility.

```html
<ids-scroll-view>
    <img slot="scroll-view-item" src="/assets/rocks-natural.png" alt="Natural Rocks">
    <img slot="scroll-view-item" src="/assets/rocks-polished-dark.png" alt="Dark Polished Rocks">
    <img slot="scroll-view-item" src="/assets/rocks-polished-light.png" alt="Light Polished Rocks">
    <img slot="scroll-view-item" src="/assets/rocks-river.png" alt="River Cured Rocks">
    <img slot="scroll-view-item" src="/assets/rocks-sea.png" alt="Sea Cured Rocks">
    <img slot="scroll-view-item" src="/assets/rocks-white.png" alt="White Rocks">
</ids-scroll-view>
```

## Settings and Attributes

None

## Themeable Parts

- `container` allows you to further style the parent container element
- `scroll-view` allows you to further style the scrolling container
- `controls` allows you to further style the control button area
- `button` allows you to further style the individual circle buttons in the carousel

## States and Variations

- Focus
- Active Slide
- Scrolling

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: Tabs you into either the content if its interactive or to the tab control area
- <kbd>ArrowLeft / ArrowRight</kbd>: Moves to the next or previous slide

## Responsive

- The container will respect the width and size of its parent flowing if necessary. If using images they may stretch so you may need to constrain the contain.

## Mobile Guidelines

- Swipe left or swipe right will do the same as clicking the next button in the list of buttons

## Converting from Previous Versions

- 3.x: Had a .inforCarousel() that was a bit more functional but used a true carousel
- 4.x: Replaces .inforCarousel() in a more limited fashion
- 4.x: Replaces .circlePage() in a more limited fashion, focusing just on the button controls and swipe containers

## Designs

[Design Specs](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)

## Accessibility Guidelines

- The first tab activated the list of tabs (the circle buttons)
- Left and up key expose the previous or next slide
- Only interactive elements on the visible slide can get focus
- The tab container gets focus with the keyboard
- The complementary landmark role is used to identify all the content and interactive controls associated with the carousel widget.
- The landmark provides a means to navigate to and identify the carousel features.
- `tablist` and `tab` roles are defined for the dots used to indicate the number of slides and which slide is selected.
- `tabpanel` roles are defined for the slide content
- `button` role is used to override semantics of the a element used to define the previous and next slide

## Regional Considerations

Internal Labels will be localized in the current language. The scroll direction and active button will be enabled. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
