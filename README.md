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
    -   `options.source` **([object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) \| [string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** The source id or source definition object
    -   `options.source-layer` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** The source layer to use -- needed for vector layers.
    -   `options.prefix` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** Prefix to use for source and style-layer ids that are created.
    -   `options.styleProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The paint property to style based on data values.
    -   `options.styleFunction` **[StyleFunction](#stylefunction)** A "style function" object defining the data-value -> paint-property-value mapping.
    -   `options.layout` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Common layout properties
    -   `options.paint` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Common paint properties

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** List of layers constituting the data-driven style that was created/added

### StyleFunction

A mapbox-gl style function.  See <https://www.mapbox.com/mapbox-gl-style-spec/#types-function>.

**Properties**

-   `property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The data property to use.
-   `stops` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** The "stops" for the style function; each item is an array of [datavalue, stylevalue].  For a small performance improvement that's not needed or supported by "real" gl style functions, the `datavalue` for a categorical function may be an array of values.
-   `type` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Function type. Controls how data values are mapped to style values:-   `'interval'` (default): a simple step function -- data values between `stops[i][0]` (inclusive) and `stops[i+1][0]` are mapped to style value `stops[i][1]`.
    -   `'categorical'`: `stops` define specific categorical values rather than ranges: `stops[i][0]` must directly match (if it's primitive) or contain (if it's an array) the feature property value.
    -   `'relative'`: Like 'interval', but data values in `stops` are interpreted as percentiles (between 0 and 1), and the style values are re-scaled on map move to be relative to the data that's on the screen. (Note that this type is not a supported mapbox-gl style function type, and requires this plugin to do extra computations each time the map moves.)

### createLayerStack

Creates a stack of layers that simulate a data-driven style.

**Parameters**

-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.styleFunction` **[StyleFunction](#stylefunction)** The style function to mimic
    -   `options.styleProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The property (e.g. fill-color) on which to apply the function.
    -   `options.stylePropertyType` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** The type of the style property (paint or layout). (optional, default `'paint'`)
    -   `options.source` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The `source` for the created layers
    -   `options.source-layer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The `source-layer` for the created layers
    -   `options.prefix` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** A prefix for layer `id`s.  Defaults to [source, source-layer].join('-')
    -   `options.layout` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Layout properites to use in the created layers
    -   `options.paint` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Paint properties to use in the created layers
    -   `options.filter` **\[[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)]** Filter to use in the craeted layers

**Examples**

```javascript
var createLayerStack = require('mapbox-gl-datadriven/create-layer-stack')
var layers = createLayerStack({
  styleFunction: {property: 'foo', stops: [[0, 'red'], [1, 'blue'], [2, 'green']]},
  styleProperty: 'fill-color',
  source: 'my-source',
  'source-layer': 'my-layer',
  paint: { 'fill-opacity': 0.5 }
})

// Output:
[
  {
    "id": "my-source-0",
    "type": "fill",
    "layout": {},
    "paint": { "fill-color": "red", "fill-opacity": 0.5 },
    "filter": [ "all", [ ">=", "foo", 0 ], [ "<", "foo", 1 ] ]
  },
  {
    "id": "undefined-1",
    "type": "fill",
    "layout": {},
    "paint": { "fill-color": "blue", "fill-opacity": 0.5 },
    "filter": [ "all", [ ">=", "foo", 1 ], [ "<", "foo", 2 ] ]
  },
  {
    "id": "undefined-2",
    "type": "fill",
    "layout": {},
    "paint": { "fill-color": "green", "fill-opacity": 0.5 },
    "filter": [ "all", [ ">=", "foo", 2 ] ]
  }
]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)>** An array of layer definitions, suitable for adding to the map with `map.addLayer()`

### createDDSFilter

Creates a style `filter` to make a layer mimic one level/stop of a
data-driven style.

**Parameters**

-   `prevFilter` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** The layer's existing filter, if it exists.  If provided, the returned filter will be combined with this one.
-   `styleFunction` **[StyleFunction](#stylefunction)** The style function for which data-driven should be mimicked.
-   `i` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** The zero-based index of the level/stop to use.

**Examples**

```javascript
var createDDSFilter = require('mapbox-gl-datadriven/create-dds-filter')
var filter = createDDSFilter(null, {property: 'foo', stops: [[0, 'red'], [1, 'blue'], [2, 'green']]}, 2)
console.log(filter)
// outputs: ['all', ['foo', '>=', 2]]
```

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** A mapbox-gl style filter.
