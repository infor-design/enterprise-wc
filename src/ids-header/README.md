# Ids Header

## Description
Displays identifying information for a given data set. Best for identifying the main object or data set in a given view.

## Settings and Attributes
- `color` {string} Sets the header background color
- `mode` {string} Sets the theme mode
- `version` {string} Sets the theme version

## Code Examples
A basic use case of the default ids header.
```html
<ids-header>
  <ids-text font-size="12" type="h1">Ids Header</ids-text>
</ids-header>
```

## Converting from Previous Versions

### Version - 4.x
```html
<header class="header is-personalizable">
  <div class="toolbar">
    <div class="title">
      <button id="application-menu-trigger" class="btn-icon application-menu-trigger" type="button">
        <span class="audible">Show navigation</span>
        <span class="icon app-header">
          <span class="one"></span>
          <span class="two"></span>
          <span class="three"></span>
        </span>
      </button>

      <h1>Page Title</h1>
    </div>

    <div class="buttonset">
      <label for="header-searchfield" class="audible">Search</label>
      <input id="header-searchfield" class="searchfield" name="header-searchfield" />
    </div>

    <div class="more">
      <button id="btn-more" class="btn-actions" type="button">
        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
          <use href="#icon-more"></use>
        </svg>
        <span class="audible" data-translate="text">More</span>
      </button>
    </div>

  </div>
</header>
```

### Version - 5.x
```html
<ids-header color="#f5f5f5">
  <ids-layout-grid>
    <ids-text font-size="12" type="h1">Header Breadcrumb</ids-text>
  </ids-layout-grid>

  <ids-layout-grid>
    <ids-breadcrumb>
      <ids-hyperlink font-size="14" color="unset" href="#">First Item</ids-hyperlink>
      <ids-hyperlink font-size="14" color="unset" href="#">Second Item</ids-hyperlink>
      <ids-hyperlink font-size="14" color="unset" disabled>Disabled Item</ids-hyperlink>
      <ids-hyperlink font-size="14" color="unset">Current Item</ids-hyperlink>
    </ids-breadcrumb>
  </ids-layout-grid>
  
</ids-header>
```