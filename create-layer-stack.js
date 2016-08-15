var createFilter = require('./create-dds-filter')
module.exports = createLayerStack

/**
 * Creates a stack of layers that simulate a data-driven style.
 *
 * @param {object} options
 * @param {StyleFunction} options.styleFunction The style function to mimic
 * @param {string} options.styleProperty The property (e.g. fill-color) on which to apply the function.
 * @param {string} [options.stylePropertyType='paint'] The type of the style property (paint or layout).
 * @param {string} options.source The `source` for the created layers
 * @param {string} options.source-layer The `source-layer` for the created layers
 * @param {string} [options.prefix] A prefix for layer `id`s.  Defaults to [source, source-layer].join('-')
 * @param {object} [options.layout] Layout properites to use in the created layers
 * @param {object} [options.paint] Paint properties to use in the created layers
 * @param {object} [options.filter] Filter to use in the craeted layers
 *
 * @returns {Array<object>} An array of layer definitions, suitable for adding to the map with `map.addLayer()`
 *
 * @example
 * var createLayerStack = require('mapbox-gl-datadriven/create-layer-stack')
 * var layers = createLayerStack({
 *   styleFunction: {property: 'foo', stops: [[0, 'red'], [1, 'blue'], [2, 'green']]},
 *   styleProperty: 'fill-color',
 *   source: 'my-source',
 *   'source-layer': 'my-layer',
 *   paint: { 'fill-opacity': 0.5 }
 * })
 *
 * // Output:
 * [
 *   {
 *     "id": "my-source-0",
 *     "type": "fill",
 *     "layout": {},
 *     "paint": { "fill-color": "red", "fill-opacity": 0.5 },
 *     "filter": [ "all", [ ">=", "foo", 0 ], [ "<", "foo", 1 ] ]
 *   },
 *   {
 *     "id": "undefined-1",
 *     "type": "fill",
 *     "layout": {},
 *     "paint": { "fill-color": "blue", "fill-opacity": 0.5 },
 *     "filter": [ "all", [ ">=", "foo", 1 ], [ "<", "foo", 2 ] ]
 *   },
 *   {
 *     "id": "undefined-2",
 *     "type": "fill",
 *     "layout": {},
 *     "paint": { "fill-color": "green", "fill-opacity": 0.5 },
 *     "filter": [ "all", [ ">=", "foo", 2 ] ]
 *   }
 * ]
 */
function createLayerStack (options) {
  var styleFunction = options.styleFunction
  var layers = styleFunction.stops.map(function (stop, i) {
    var layout = {}
    var paint = {}
    var styleValue = stop[1]
    if (options.stylePropertyType === 'layout') {
      layout[options.styleProperty] = styleValue
    } else {
      paint[options.styleProperty] = styleValue
    }
    var prefix = options.prefix
    if (!prefix) {
      prefix = [options.source, options['source-layer']].filter(Boolean).join('-')
    }
    return {
      id: prefix + '-' + i,
      source: options.source,
      'source-layer': options['source-layer'],
      type: options.type || 'fill',
      layout: Object.assign(layout, options.layout),
      paint: Object.assign(paint, options.paint),
      filter: createFilter(options.filter, styleFunction, i)
    }
  })
  return layers
}
