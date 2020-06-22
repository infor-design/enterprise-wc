# Ids Tag Component

## Description

Tags are UI embellishments that are used to label, categorize and organize keywords surrounding
some contextual element such as a form. Be car

## Use Cases

- Use when the content on your page is mapped into multiple categories and does not only fit into one hierarchical category.
- Use when you want users to contribute data to your website and let them organize their content themselves.

## Terminology

Tag -   A UI embellishments for classification
Dismissible -   Tag can be closed with an X
Classification -   How tags are labelled with colors and text

## Features (With Code Examples)

A normal tag used as a web component.

```html
<ids-tag>Normal Tag</ids-tag>
```

A normal tag used using just the css. This is limited to normal tags only.

```html
<span class="ids-tag">Normal Tag</span>
```

A colored tag is done by adding the `color` attribute and one of the following: secondary, error, success, caution or a hex color beginning with a # character.

```html
<ids-tag color="secondary">Secondary Tags</ids-tag>
<ids-tag color="error">Error Tag</ids-tag>
<ids-tag color="success">Success Tag</ids-tag>
<ids-tag color="caution">Warning Tag</ids-tag>
<ids-tag color="#EDE3FC">Custom Tag Color</ids-tag>
```

Clickable/Dismissible -   Tag can be closed with an X.
Linkable -   Tag can be followed as a link, when it does it has an caret to show its a link.
Disabled -   Tag can be disabled so it cannot be followed or clicked.

## States and Variations (With Code Examples)

- Color (See Color)
- Linkable
- Badge
- Disabled
- Closable

## Keyboard Guidelines

- <kbd>Tab/Shift+Tab</kbd>: If the tab is focusable this will focus or unfocus the tag.
- <kbd>Backspace / Alt+Del</kbd>: If the tag is dismissible then this will remove the tag.
- <kbd>Enter</kbd>: If the tag is clickable then this will follow the tag link.

## Responsive Guidelines

- Flows with padding and margin within the width and height of the parent container. Possibly scrolling as needed based on parent css.

## Converting from Previous Versions

3.x - Tags have new markup and classes.
4.x - Tags have new markup and classes for web components.

## Designs

[Figma Design Specs](https://www.figma.com/files/team/715586812838044954/Hook%26Loop)

## Alternate Designs

NA

## Proposed Changes

- Fix Accessibility issue (1.4.1 Use of Color) by adding an icon to the color tags.
- Fix Accessibility issue (1.4.3 Contrast (Minimum)) by changing or not using some tags

## Test Plan

1. Works with 4.x version in the same page
1. Accessibility - Color Contrast
1. Accessibility - Web Aim
1. Accessibility - Keyboard
1. Visual Regression Tests for all states
1. Click Events
1. Clickable
1. Linkable/Clickable
1. Resize/Responsive Behavior
1. Repeat Tests in All Supported Browsers
1. Some of these as test cases from the [WC gold standard](https://github.com/webcomponents/gold-standard/wiki#api)
1. Can be consumed (pull it in standalone/built see it works standalone)

## QA - BDD Steps

### Scenario 1: Dismissible Tag

Given I am on desktop
And I am on the tag page
Then I should see page with different tag examples
And able to navigate in each example Tags
And when I click the ‘#Dismissible’ tag
Then I the Tag should be removed or disappear in the example list.

### Scenario 2: Clickable / Linkable Tag

Given I am on desktop
And I am on the tag page
Then I should see page with different Linkable tag examples
And able to navigate in each example Tags
And when I click the ‘Linkable Tag Info >’ tag
Then I should be able to redirect or navigate through the selected Tag

### Scenario 3: Colors

Given I am on desktop
And I am on the tag page
Then I should see page with different Linkable tag examples
And able to navigate in each example Tags
And I should be able to see Tags with different color e.g (Red, Green Yellow)

## Accessibility Guidelines

- 1.4.1 Use of Color - Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. Ensure the color tags that indicate state like OK, cancel, ect have other ways to indicate that information. This is failing.
- 1.4.3 Contrast (Minimum) - The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.   Ensure the color tags pass contrast.

## Regional Considerations

Labels should be localized in the current language. The close and link icons should flip to the alternate side in Right To Left mode. In some languages test may be a lot longer (German) and not wrap (Thai)
