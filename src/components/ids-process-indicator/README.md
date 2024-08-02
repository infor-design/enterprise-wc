# ids-process-indicator

## Description

Indicates the process of an activity over a timeline with process steps showing details and status of what needs to be done and/or has been done/started/cancelled.

## Use Cases

- To show which stages of production are complete in a development lifecycle and what is left to be finished

## Terminology

- **Process Step**: each task/stage/to-do within the whole process
- **Status**: done, started, or cancelled as indicated by a filled circle, empty circle, or red circle with an X, respectively
- **Label**: the title of the process step

## Settings (Attributes)

Utilizes the child component IDS Process Step  which has `label` and `status` attribute. The colored process line will draw to the farthest process step with a non-null status. Which has the following attributes:

- `label` {string} the title of the process step
- `status` {string} `done` || `started` || `cancelled`

## Features (With Code Samples)

A simple process indicator with 3 process steps

```html
  <ids-process-indicator>
    <ids-process-indicator-step label="Preparation" status="done"></ids-process-indicator-step>
    <ids-process-indicator-step label="Manufacturing" status="started"></ids-process-indicator-step>
    <ids-process-indicator-step label="Final Stage"></ids-process-indicator-step>
  </ids-process-indicator>
```

A simple process indicator with 2 process steps and additional details

```html
  <ids-process-indicator>
    <ids-process-indicator-step label="Preparation" status="done">
      <ids-text>Order the parts<ids-text>
      <ids-text>Jan 31, 2021</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="Manufacturing" status="started">
      <ids-text>Assemble and package product</ids-text>
      <ids-text>Anticipated: Mar 1, 2021</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="Final Stage" status="started">
      <ids-text>Deliver product to stores</ids-text>
      <ids-text>Anticipated: July 1, 2021</ids-text>
    </ids-process-indicator-step>
  </ids-process-indicator>
```

A process indicator with 4 process steps and the 3 different possible statuses

```html
  <ids-process-indicator>
    <ids-process-indicator-step label="Preparation" status="done">
      <ids-text>Order the parts<ids-text>
      <ids-text>Jan 31, 2021</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="Manufacturing" status="started">
      <ids-text>Assemble and package product</ids-text>
      <ids-text>Anticipated: Mar 1, 2021</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="Advertising" status="cancelled">
      <ids-text>Assemble and package product</ids-text>
      <ids-text>Anticipated: May 1, 2021</ids-text>
      <ids-text>Cancelled due to COVID-19</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="Final Stage">
      <ids-text>Deliver product to stores</ids-text>
      <ids-text>Anticipated: July 1, 2021</ids-text>
    </ids-process-indicator-step>
  </ids-process-indicator>
```

## Responsive Guidelines

- The component stretches to 100% width of its container (horizontal orientation)

## Converting from Previous Versions (Breaking Changes)

**3.x to 4.x**

- Process Indicator was a new componet in v4.0.0
- Can be invoked with `$('#my-element').processindicator();`

**4.x to 5.x**

- Process Indicator is now a custom element `<ids-process-indicator></ids-process-indicator>`

### Converting from 4.x

```html
    <div class="process-indicator compact responsive has-labels">
      <span class="responsive-label"><span>Current:</span> 3rd Level - Multiple Approvers</span>
      <div class="display">

        <div class="step" id="step3" data-automation-id="step3-automation-id">
          <span class="label">2nd Level</span>
          <div class="lines">
            <span class="indicator darker"></span>
            <span class="separator darker"></span>
          </div>
          <div class="details">
            <span class="heading">Unreleased</span>
            <a class="hyperlink hide-focus" href="#">
              <svg class="icon icon-success" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-success"></use>
              </svg>
              <span>Melissa Nash</span>
            </a>
            <span>January 22, 2021 | 02:42AM</span>
          </div>
        </div>

        <div class="step current" id="step4" data-automation-id="step4-automation-id">
          <span class="label">3rd Level - Multiple Approvers</span>
          <div class="lines">
            <span class="indicator processing"></span>
            <span class="separator darker"></span>
          </div>
          <div class="details">
            <span class="heading">Unreleased</span>
            <a class="hyperlink hide-focus" href="#">
              <svg class="icon icon-success" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-success"></use>
              </svg>
              <span>Garret Rounds</span>
            </a>
            <a class="hyperlink hide-focus" href="#">
              <svg class="icon icon-empty-circle" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-empty-circle"></use>
              </svg>
              <span>Evelyn Lewis</span>
            </a>
            <span>Feb 2, 2021 | 21:12AM</span>
          </div>
        </div>

        <div class="step" id="step5" data-automation-id="step5-automation-id">
          <span class="label">4th level</span>
          <div class="lines">
            <span class="indicator icon current">
              <svg class="icon icon-rejected-solid" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-rejected-solid"></use>
              </svg>
            </span>
            <span class="separator"></span>
          </div>
          <div class="details">
            <span class="heading">Status</span>
            <a class="hyperlink hide-focus" href="#">
              <svg class="icon icon-rejected-outline" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-rejected-outline"></use>
              </svg>
              <span>John Jones</span>
            </a>
            <a class="hyperlink hide-focus" href="#">
              <svg class="icon icon-empty-circle" focusable="false" aria-hidden="true" role="presentation">
                 <use href="#icon-empty-circle"></use>
              </svg>
              <span>James Martin</span>
            </a>
            <span>Feb 12, 2021 | 14:12AM</span>
          </div>
        </div>
      </div>
    </div>


```
is the 4.x equivalent of the web component example below

```html
  <ids-process-indicator>
    <ids-process-indicator-step label="2nd Level" status="done">
      <ids-text>Unreleased</ids-text>
      <ids-icon icon="success" size="small"></ids-icon>
      <ids-hyperlink href="#"><span>Melissa Nash</span></ids-hyperlink>
      <ids-text class="date">January 22, 2021 02:42 AM</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="3rd Level - Multiple Approvers" status="started">
      <ids-text>Unreleased</ids-text>
      <ids-icon icon="success" size="small"></ids-icon>
      <ids-hyperlink href="#"><span>Garret Rounds</span></ids-hyperlink>
      <br>
      <ids-icon icon="empty-circle" size="small"></ids-icon>
      <ids-hyperlink href="#"><span>Evelyn Lewis</span></ids-hyperlink>
      <ids-text class="date">Feb 2, 2021 21:12 AM</ids-text>
    </ids-process-indicator-step>
    <ids-process-indicator-step label="4th Level" status="cancelled">
      <ids-text>Status</ids-text>
      <ids-icon icon="rejected-outline" size="small"></ids-icon>
      <ids-hyperlink href="#"><span>John Jones</span></ids-hyperlink>
      <br>
      <ids-icon icon="empty-circle" size="small"></ids-icon>
      <ids-hyperlink href="#"><span>James Martin</span></ids-hyperlink>
      <ids-text class="date">Feb 12, 2021 14:12 AM</ids-text>
    </ids-process-indicator-step>
  </ids-process-indicator>
```
