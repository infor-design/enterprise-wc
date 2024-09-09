# ids-swipe-action

## Description

The swipe action component is a simple component with one or two buttons on the left and right. The user can swipe left or right and activate the action or swipe left and right and click the button to activate the action. On desktop the user will use the actions button with a popup.

## Use Cases

- When you have a mobile heavy application and need to put swipe actions on a container

## Terminology

- **swipe**: An act or instance of moving one's finger across a touchscreen to activate a function.

## Features (With Code Examples)

A normal swipe action with two actions. In continuous mode the action will be executed as you swipe.

```html
<ids-card auto-height="true">
  <div slot="card-content">
    <ids-swipe-action swipe-type="continuous">
      <ids-button slot="action-left" id="action-left-continuous" type="swipe-action-left">
        <ids-icon icon="reply" size="small"></ids-icon>
        <span>Left Action</span>
      </ids-button>
      <div slot="contents">
        <ids-layout-grid cols="2" no-margins="true">
          <ids-layout-grid-cell>
            <ids-text font-size="16">Tuesday, 22nd September</ids-text>
            <ids-text font-size="14">8:40AM-2:00PM</ids-text>
          </ids-layout-grid-cell>
          <ids-layout-grid-cell justify="end">
            <ids-menu-button id="actions-continuous" menu="actions-continuous-menu">
              <ids-icon icon="more"></ids-icon>
              <span class="audible">Actions</span>
            </ids-menu-button>
            <ids-popup-menu id="actions-continuous-menu" target="actions-continuous" trigger-type="click">
              <ids-menu-group>
                <ids-menu-item>Right Action</ids-menu-item>
                <ids-menu-item>Left Action</ids-menu-item>
                <ids-menu-item>Other Action</ids-menu-item>
              </ids-menu-group>
            </ids-popup-menu>
          </ids-layout-grid-cell>
        </ids-layout-grid>
      </div>
      <ids-button slot="action-right" id="action-right-continuous" type="swipe-action-right">
        <ids-icon icon="tack" size="small"></ids-icon>
        <span>Right Action</span>
      </ids-button>
    </ids-swipe-action>
  </div>
</ids-card>
```

## Settings and Attributes

- `swipeType` {string} Set the swipe interaction method between continuous and reveal (default)

## Themeable Parts

- `container` allows you to further style the container element
- `action-left` allows you to further style the left action button
- `action-right` allows you to further style the right action button

## States and Variations

- Open
- Closed

## Keyboard Guidelines

The swipe action is not keyboard friendly. For this we use the actions button for keyboard users.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container.
- The swipe does work to a limited degree on chrome via a scroll action. But it is not the most user friendly interaction. For this we use the actions button for keyboard users.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Swipe Action is a new component in v4.53.0
- Invoke Swipe Action on an element with `$('#my-element').swipeaction();`

**4.x to 5.x**

- Swipe Action has been added as a custom element `<ids-swipe-action></ids-swipe-action>`

## Designs

[Design Specs](https://www.figma.com/file/yaJ8mJrqRRej8oTsd6iT8P/IDS-(SoHo)-Component-Library-v4.5?node-id=760%3A771)
