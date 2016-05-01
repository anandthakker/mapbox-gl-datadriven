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

See also [example.html](https://anandthakker.github.com/mapbox-gl-datadriven/example.html).

## API

### datadriven

Add layers that mimic 'data-driven' style properties for Mapbox GL JS.

**Parameters**

-   `map` **[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)** The mapbox-gl-js map instance
-   `options.paint` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Common paint properties
-   `options.source` **([object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)\|[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String))** The source id or source definition object
-   `options.source-layer` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** The source layer to use -- needed for vector layers.
-   `options.prefix` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)=** Prefix to use for source and style-layer ids that are created.
-   `options` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
    -   `options.styleFunction` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** A "style function" object defining the data-value -> paint-property-value mapping.
        -   `options.styleFunction.property` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The data property to use.
        -   `options.styleFunction.stops` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)** The "stops" for the style function; each item is an array of [datavalue, stylevalue].
    -   `options.layout` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)=** Common layout properties
    -   `options.styleProperty` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** The paint property to style based on data values.
