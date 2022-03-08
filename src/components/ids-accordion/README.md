# Ids Accordion Component

## Description

The IDS Accordion component is a UI pattern that is comprised of a stacked list of elements. A basic accordion will consist of a `ids-accordion-header` which shows a title or summary of the `ids-accordion-panel` and acts as a control for expanding and collapsing. Note: Standalone Css is not available for this component.

## Use Cases

- Can be used to conserve space, by hiding information until needed. Accordions can be commonly seen on mobile sites and applications. It can help tell the user what the page is about and allows the user to select and see what is needed.
- Can be used for navigation.  The accordion is the main interactive element inside of the [App Menu](../ids-app-menu/README.md)

## Terminology

- **ids-accordion** Parent container for all accordions
- **ids-accordion-panel** First child of and accordion. Contains the header and content area. Contains 2 slots, the `header` and the `pane`.
- **ids-accordion-header** Typically used in the header slot, contains the title and acts as the control for expanding and collapsing.

## Features (With Code Examples)

Standard accordion, most commonly used:

```html
<ids-accordion>
    <ids-accordion-panel>
        <ids-accordion-header slot="header">
            <ids-text font-size="16">Warehouse Location</ids-text>
        </ids-accordion-header>
        <ids-text slot="content">
            Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds
            front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer
            authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain, deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.
        </ids-text>
    </ids-accordion-panel>
    <ids-accordion-panel>
        <ids-accordion-header slot="header">
            <ids-text font-size="16">Sort By</ids-text>
        </ids-accordion-header>
        <ids-text slot="content">
            Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds
            front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer
            authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit
            data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize
            best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain,
            deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation
            tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.
        </ids-text>
    </ids-accordion-panel>
    <ids-accordion-panel>
        <ids-accordion-header slot="header">
            <ids-text font-size="16">Brand Name</ids-text>
        </ids-accordion-header>
        <ids-text slot="content">
            Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds
            front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer
            authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit
            data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize
            best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain,
            deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation
            tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.
        </ids-text>
    </ids-accordion-panel>
    <ids-accordion-panel>
        <ids-accordion-header slot="header">
            <ids-text font-size="16">Material</ids-text>
        </ids-accordion-header>
        <ids-text slot="content">
            Remix, optimize, "B2B, iterate?" Best-of-breed efficient beta-test; social cutting-edge: rich magnetic tagclouds
            front-end infomediaries viral authentic incentivize sexy extensible functionalities incentivize. Generate killer
            authentic grow vertical blogospheres, functionalities ecologies harness, "tag solutions synergies exploit
            data-driven B2C open-source e-markets optimize create, enhance convergence create." Out-of-the-box strategize
            best-of-breed back-end, deploy design markets metrics. Content web services enhance leading-edge Cluetrain,
            deliverables dot-com scalable. User-centric morph, back-end, synthesize mesh, frictionless, exploit next-generation
            tag portals, e-commerce channels; integrate; recontextualize distributed revolutionize innovative eyeballs.
        </ids-text>
    </ids-accordion-panel>
</ids-accordion>
```

### Nested Accordions

It's possible to nest accordion structures.  This is common in accordions used for navigation purposes, such as the ones applied to the [App Menu](../ids-app-menu/README.md).

In the example below, the "My Benefits", "Dependents and Beneficiaries", "Life Events", and "Benefits Information" panels are nested beneath the "Benefits" panel, which is nested beneath the "Employee" panel.

```html
<ids-accordion id="app-menu-style">
    <ids-accordion-panel id="employee">
        <ids-accordion-header slot="header">
            <ids-icon icon="user" size="medium"></ids-icon>
            <ids-text font-size="16">Employee</ids-text>
        </ids-accordion-header>
        <ids-accordion-panel slot="content" id="benefits">
            <ids-accordion-header slot="header" expander-type="plus-minus">
                <ids-text font-size="14">Benefits</ids-text>
            </ids-accordion-header>
            <ids-accordion-panel slot="content" id="my-benefits">
                <ids-accordion-header slot="header">
                    <ids-text font-size="14">My Benefits</ids-text>
                </ids-accordion-header>
            </ids-accordion-panel>
            <ids-accordion-panel slot="content" id="dependents-beneficiaries">
                <ids-accordion-header slot="header">
                    <ids-text font-size="14">Dependents and Beneficiaries</ids-text>
                </ids-accordion-header>
            </ids-accordion-panel>
            <ids-accordion-panel slot="content" id="life-events">
                <ids-accordion-header slot="header">
                    <ids-text font-size="14">Life Events</ids-text>
                </ids-accordion-header>
            </ids-accordion-panel>
            <ids-accordion-panel slot="content" id="benefits-information">
                <ids-accordion-header slot="header">
                    <ids-text font-size="14">Benefits Information</ids-text>
                </ids-accordion-header>
            </ids-accordion-panel>
        </ids-accordion-panel>
    </ids-accordion-panel>
</ids-accordion>
```

## Settings and Attributes

When used as an attribute the settings are kebab case, when used in the JS they are camel case.

- `headers` {Array<IdsAccordionHeader>} Reference to all inner Accordion Headers.
- `panels` {Array<IdsAccordionPanel>} Reference to all inner Accordion Panels.
- `focused` {HTMLElement} Reference to the currently-focused element within the accordion, if applicable.
- `allowOnePane` {boolean} Sets Accordion to allow only one inner Accordion Panel to be expanded at a time.

## States and Variations

The Accordion's headers support the following states:

- Normal/Default: This is the default of an accordion.
- Hover: Roll over an interactive element inside the accordion
- Disabled: Disabled elements can be inside an accordion. These cards cannot be clicked, hovered or focused.
- Focus: For accessibility. To give a user guidance when using a screen reader.
- Active/Selected: After the pressed/clicked state, users are taken to the active state. This includes expanding or closing an accordion.

## Keyboard Guidelines

- **Shift+Tab**: Works the same as Tab, but in the opposite direction. When focus is on the tab or accordion header, a press of down/right will move focus to the next logical accordion Header or Tab page. When focus reaches the last header/tab page, further key presses will have optionally wrap to the first header
- **Up Arrow or Left Arrow**: When focus is on the tab or accordion header, a press of up/left will move focus to the previous logical accordion header or tab page. When focus reaches the first header/tab page, further key presses will optionally wrap to the last header.  This keystroke is also aware of how to traverse different levels of nested accordion panels.
- **Down Arrow or Right Arrow**: When focus is on the tab or accordion header, a press of down/right will move focus to the next logical accordion header or tab page. When focus reaches the last header/tab page, further key presses will optionally wrap to the first header.  This keystroke is also aware of how to traverse different levels of nested accordion panels.
- **Enter or Space**: When focus is on an accordion header, this keystroke toggles the expansion of the corresponding panel. If collapsed, the panel is expanded, and its aria-expanded state is set to true. If expanded, the panel is collapsed and its aria-expanded state is set to false.

## Accessibility

The IDS Accordion component has a `role="region"` and a unique `title` is generated for each instance.

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**
- Replace `.inforAboutDialog()` with `.about()` and notice that many of the names of the settings (e.g. productName to appName) to have changed so must be updated to the new settings.
- The initial markup is changed considerably from the previous version. Sync the markup using the markup above
- Initialize the accordion plugin with .accordion() as opposed to `.inforAccordion()` or by using the page initializer
onExpanded and onCollapsed option are done with events (expanded and collapsed)

**4.x to 5.x**
- Accordion now uses all new markup and classes for web components (see above)
- Now called IdsAccordion with a namespace
- The "Panels" examples are removed and deprecated as they should rarely be used.
- The deprecated `displayChevron` setting is removed.
- The `enableTooltips` removed and deprecated as not added as it seems no longer relevant.
- The `expanderDisplay` option was removed and deprecated as it was used only by IdsAppMenu and is no longer needed.
- The `rerouteOnLinkClick` option was removed and deprecated as is no longer needed as there are no links in the markup now.
- The `source` option was removed and deprecated as it was used only by IdsAppMenu and is no longer needed in accordion but will be added to IdsAppMenu.
- The `destroy` method has been removed since everything is now cleaned up when removing the DOM element
