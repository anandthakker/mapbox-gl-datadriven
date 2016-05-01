[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

A stopgap to mimic [data-driven styles in mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js/pull/1932); hopefully obsolete very soon!

## Install

    npm install mapbox-gl-datadriven

## Usage

```js
mapboxgl.datadriven(map, {
  source: {
    type: 'vector',
    url: 'mapbox://user/tileset'
  },
  'source-layer': 'my-layer',
  paint: {
    'fill-color': '#ff8800'
  },
  styleProperty: 'fill-opacity',
  styleFunction: {
    property: 'my-property',
    stops: [
      [0, 0],
      [10, 0.25],
      [30, 0.5],
      [100, 0.75],
      [300, 1]
    ]
  }
})
```

See also [example.html](https://anandthakker.github.com/mapbox-gl-datadriven/example.html)
and [example-relative.html](https://anandthakker.github.com/mapbox-gl-datadriven/example.html).

## API

### datadriven

Add layers that mimic 'data-driven' style properties for Mapbox GL JS.
Access with `require('mapbox-gl-datadriven')` or `mapboxgl.datadriven`.

**Parameters**

-   `map` **[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)** The mapbox-gl-js map instance
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.source` **([object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)\|[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** The source id or source definition object
    -   `options.source-layer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** The source layer to use -- needed for vector layers.
    -   `options.prefix` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Prefix to use for source and style-layer ids that are created.
    -   `options.styleProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The paint property to style based on data values.
    -   `options.styleFunction` **StyleFunction** A "style function" object defining the data-value -> paint-property-value mapping.
    -   `options.layout` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Common layout properties
    -   `options.paint` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Common paint properties

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array).&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** List of layers constituting the data-driven style that was created/added

### StyleFunction

**Properties**

-   `property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The data property to use.
-   `stops` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** The "stops" for the style function; each item is an array of [datavalue, stylevalue].
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function type. Controls how data values are mapped to style values:-   Default: a simple step function -- data values between `stops[i][0]` (inclusive) and `stops[i+1][0]` are mapped to style value `stops[i][1]`.
    -   `'relative'`: Same as default, but data values in `stops` are interpreted as percentiles (between 0 and 1), and the style values are re-scaled on map move to be relative to the data that's on the screen.
    -   `'categorical'`: `stops` define specific categorical values rather than ranges: `stops[i][0]` must directly match (if it's primitive) or contain (if it's an array) the feature property value.
