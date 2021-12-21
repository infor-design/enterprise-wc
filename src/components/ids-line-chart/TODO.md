# TODO's For Line Charts

## General
- [ ] Remove commented web pack config

## Rendering
- [ ] Axis
- [ ] Linear Scale
- [ ] Nice Scales https://stackoverflow.com/a/38702859/852398

## Accessibility
- [ ] Should be keyboard friendly. Can focus the legend and hit enter to select.
- [ ] When keying in to the legend elements it should read the data
- [ ] Have a table option to display the data in optional data form.
- [ ] SVG Patterns for accessibility

## Interaction

- [ ] When hovering over the dot it should show the tooltip
- [ ] When clicking the line it should select

http://jsfiddle.net/roemer/tKNcp/

A Working Example
<pre>
<svg class="ids-line-chart" aria-labelledby="title" role="img">
      <title id="title">${this.title}</title>
      <g class="x-axis">
        <line x1="95" x2="85" y1="5" y2="370"></line>
        <line x1="95" x2="705" y1="10" y2="10"></line>
      </g>
      <g class="grid-lines">
        <line x1="95" x2="705" y1="10" y2="10"></line>
        <line x1="95" x2="705" y1="126" y2="126"></line>
        <line x1="95" x2="705" y1="243" y2="243"></line>
      </g>
      <g class="y-axis">
        <line x1="95" x2="705" y1="370" y2="370"></line>
      </g>
      <g class="x-axis labels">
        <text x="100" y="400" class="tick">2008</text>
        <text x="246" y="400" class="tick">2009</text>
        <text x="392" y="400" class="tick">2010</text>
        <text x="538" y="400" class="tick">2011</text>
        <text x="684" y="400" class="tick">2012</text>
        <text x="400" y="440" class="axis-label">Year</text>
      </g>
      <g class="y-axis labels">
        <text x="80" y="15" class="tick">15</text>
        <text x="80" y="131" class="tick">10</text>
        <text x="80" y="248" class="tick">5</text>
        <text x="80" y="373" class="tick">0</text>
        <text x="50" y="200" class="axis-label">Price</text>
      </g>
      <g class="data" data-setname="Component One">
        <polyline class="data-line" points="90,192 240,141 388,179 531,200 677,104"/>
        <circle cx="90" cy="192" data-value="7.2" r="5"></circle>
        <circle cx="240" cy="141" data-value="8.1" r="5"></circle>
        <circle cx="388" cy="179" data-value="7.7" r="5"></circle>
        <circle cx="531" cy="200" data-value="6.8" r="5"></circle>
        <circle cx="677" cy="104" data-value="6.7" r="5"></circle>
      </g>
    </svg>
</pre>
