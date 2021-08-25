# Ids Accordion Component

## Description

The IDS Accordion component is a UI pattern that is comprised of a stacked list of elements. A basic accordion will consist of a `ids-accordion-header` which shows a title or summary of the `ids-accordion-panel` and acts as a control for expanding and collapsing.

## Use Cases

Can be used to conserve space, by hiding information until needed. Accordions can be commonly seen on mobile sites and applications. It can help tell the user what the page is about and allows the user to select and see what is needed.

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

## States and Variations

The Accordion's headers support the following states:

- Normal/Default: This is the default of an accordion.
- Hover: Roll over an interactive element inside the accordion
- Disabled: Disabled elements can be inside an accordion. These cards cannot be clicked, hovered or focused.
- Focus: For accessibility. To give a user guidance when using a screen reader.
- Active/Selected: After the pressed/clicked state, users are taken to the active state. This includes expanding or closing an accordion.

## Keyboard Guidelines

- **Shift+Tab**: Works the same as Tab, but in the opposite direction. When focus is on the tab or accordion header, a press of down/right will move focus to the next logical accordion Header or Tab page. When focus reaches the last header/tab page, further key presses will have optionally wrap to the first header
- **Up Arrow or Left Arrow**: When focus is on the tab or accordion header, a press of up/left will move focus to the previous logical accordion header or tab page. When focus reaches the first header/tab page, further key presses will optionally wrap to the first header.
- **Enter or Space**: When focus is on an accordion header, this keystroke toggles the expansion of the corresponding panel. If collapsed, the panel is expanded, and its aria-expanded state is set to true. If expanded, the panel is collapsed and its aria-expanded state is set to false.

## Accessibility

The IDS Accordion component has a `role="region"` and a unique `title` is generated for each instance.
