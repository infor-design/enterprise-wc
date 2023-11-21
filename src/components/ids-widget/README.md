# Ids Widget Component

## Description

Widgets are specialized cards that are use primarily in the home page layout. They have a series of featured that are useful to widget developers. And features that allow the end user to interact with the widget and its content.

## Use Cases

- Use when you want to display content in widget in a home page layout
- Use when you want to display content in a card-like format with a header, body and footer

## Dos and Don'ts

- Overcrowd your content with widgets full of information, so people can see the items clearly
- Try to succinctly capture the information by role

## Terminology

- **Widget**: Element of a graphical user interface that displays information or provides a specific way for a user to interact with
- **System Button**: A button provided by the portal thats not a part of the widget contents. For example the actions button.

## Features (With Code Examples)

A simple bordered widget.

```html
<ids-home-page>
  <ids-widget slot="widget">
    <div slot="widget-header">
      <ids-toolbar>
        <ids-toolbar-section type="title" favor>
          <ids-text font-size="20">Bordered</ids-text>
        </ids-toolbar-section>
        <ids-toolbar-section type="buttonset" align="end">
          <ids-menu-button menu="icon-actions" id="actions-button" system-button>
            <ids-icon icon="vertical-ellipsis"></ids-icon>
            <span class="audible">Actions</span>
          </ids-menu-button>
          <ids-popup-menu id="icon-actions" target="#actions-button">
            <ids-menu-group>
              <ids-menu-item>Action one</ids-menu-item>
              <ids-menu-item>Action two</ids-menu-item>
            </ids-menu-group>
          </ids-popup-menu>
        </ids-toolbar-section>
      </ids-toolbar>
    </div>
    <div slot="widget-content"></div>
  </ids-widget>
</ids-home-page>
```

To use system buttons in your widget, add the system-button attribute on the button element. The rule is that if there is just one system button it should be hidden. But if there is other actions it should not be hidden. In that case remove the system-button attribute.

## Class Hierarchy

- IdsWidget
    - IdsBox
      - IdsElement
- Mixins
  IdsEventsMixin
  IdsScrollEffectMixin

## Settings (Attributes)

- `system-button` {boolean} Makes any button a system button that is hidden unless hovering the widget
- `borderless` {boolean} Set the widget to have no borders and no background color
- `height` {boolean} Set a specific height and center the widget
- `noHeader` {boolean} Set to true to hide the header and reclaim the space
- `overflow` {string} Set how the container overflows, can be hidden or auto (default
- `paddingX` {string} Set the x axis padding on the widget contents (in pixels)
- `paddingY` {string} Set the y axis padding on the widget contents (in pixels)

## Themeable Parts

- `widget` allows you to further style the whole widget input element
- `header` allows you to further style the widget header element
- `search` allows you to further style the widget search element in the header
- `content` allows you to further style the widget content area

## States and Variations

- Color
- Disabled
- Hover
- Focus
- Size
- System Actions

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: Will tab you into the widget and then into the content area.
- <kbd>Enter</kbd>: If widget item is clickable then this will follow activate the click.

## Responsive Guidelines

- Is entirely controlled by the home page component. Will follow its rules for sizing.

## Converting from Previous Versions (Breaking Changes)

**4.x to 5.x**

- Widgets are now custom elements `<ids-widget></ids-widget>`
- If using properties/settings these are now attributes: `height`, `overflow`
- Can now be imported as a single JS file and used with encapsulated styles
- Widgets replace cards but have only the features needed for widgets. See `ids-card` for some features.

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Labels should be localized in the current language. The close and actions or other buttons will flip to the alternate side in Right To Left mode. Consider that in some languages text may be a lot longer (German). And in some cases it cant be wrapped (Thai).
