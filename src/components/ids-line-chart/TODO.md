# TODO's For Line Charts

## General
- [ ] Remove commented web pack config

## Rendering
- [ ] Axis
- [ ] Linear Scale
- [ ] Nice Scales https://stackoverflow.com/a/38702859/852398
- [ ] Empty Messages
- [ ] Themes
- [ ] Axis Formatters (k,m ect)
- [ ] Short Name

## Accessibility
- [ ] Should be keyboard friendly. Can focus the legend and hit enter to select.
- [ ] When keying in to the legend elements it should read the data
- [ ] Have a table option to display the data in optional data form.
- [ ] SVG Patterns for accessibility

## Interaction

- [ ] When hovering over the dot it should show the tooltip
- [ ] When clicking the line it should select

## Future

- [ ] Negative Values

http://jsfiddle.net/roemer/tKNcp/

A Working Example (first try)
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


Working example (second try)
<pre>
  <svg class="ids-line-chart" part="chart" width="${this.width}" height="${this.height}" xmlns="http://www.w3.org/2000/svg">
    <title id="title">${this.title}</title>
    <g class="grid x-lines">
        <line x1="113" x2="113" y1="10" y2="380"></line>
        <line x1="259" x2="259" y1="10" y2="380"></line>
        <line x1="405" x2="405" y1="10" y2="380"></line>
        <line x1="551" x2="551" y1="10" y2="380"></line>
        <line x1="697" x2="697" y1="10" y2="380"></line>
    </g>
    <g class="grid y-lines">
        <line x1="86" x2="697" y1="10" y2="10"></line>
        <line x1="86" x2="697" y1="68" y2="68"></line>
        <line x1="86" x2="697" y1="126" y2="126"></line>
        <line x1="86" x2="697" y1="185" y2="185"></line>
        <line x1="86" x2="697" y1="243" y2="243"></line>
        <line x1="86" x2="697" y1="301" y2="301"></line>
        <line x1="86" x2="697" y1="360" y2="360"></line>
    </g>
    <g class="markers" data-setname="Component One">
        <circle cx="113" cy="192" data-value="7.2" r="5"></circle>
        <circle cx="259" cy="171" data-value="8.1" r="5"></circle>
        <circle cx="405" cy="179" data-value="7.7" r="5"></circle>
        <circle cx="551" cy="200" data-value="6.8" r="5"></circle>
        <circle cx="697" cy="204" data-value="6.7" r="5"></circle>
    </g>
    <g class="marker-lines">
        <polyline class="data-line" points="113,192 259,171 405,179 551,200 697,204"/>
    </g>
    <g class="areas">
        <path d="M113,360 L113,192 L259,171 L405,179 L551,200 L697,204 L697,360 Z"></path>
    </g>
    <g class="labels x-labels">
        <text x="113" y="400">2008</text>
        <text x="259" y="400">2009</text>
        <text x="405" y="400">2010</text>
        <text x="551" y="400">2011</text>
        <text x="697" y="400">2012</text>
    </g>
    <g class="labels y-labels">
        <text x="80" y="15">15</text>
        <text x="80" y="131">10</text>
        <text x="80" y="248">5</text>
        <text x="80" y="365">0</text>
        <text x="50" y="15" class="axis-label">Weeks</text>
    </g>
    </svg>
</pre>
