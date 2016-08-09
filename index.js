'use strict'

var d3array = require('d3-array')
var createLayerStack = require('./create-layer-stack')
var getFilter = require('./get-filter')

module.exports = datadriven

/**
 * Add layers that mimic 'data-driven' style properties for Mapbox GL JS.
 * Access with `require('mapbox-gl-datadriven')` or `mapboxgl.datadriven`.
 *
 * @param {Map} map The mapbox-gl-js map instance
 * @param {object} options
 * @param {object|string} options.source The source id or source definition object
 * @param {string} [options.source-layer] The source layer to use -- needed for vector layers.
 * @param {string} [options.prefix] Prefix to use for source and style-layer ids that are created.
 * @param {string} options.styleProperty The paint property to style based on data values.
 * @param {StyleFunction} options.styleFunction A "style function" object defining the data-value -> paint-property-value mapping.
 * @param {object} [options.layout] Common layout properties
 * @param {object} [options.paint] Common paint properties
 *
 * @returns {Array<String>} List of layers constituting the data-driven style that was created/added
 */
function datadriven (map, options) {
  var source = options.source
  var styleFunction = options.styleFunction
  var stopDataValues = styleFunction.stops.map(function (s) { return s[0] })

  if (typeof source === 'object') {
    source = options.prefix || 'mapbox-gl-datadriven'
  }

  var layers = createLayerStack(Object.assign({source: source}, options))

  ensureStyle(map, function () {
    if (typeof options.source === 'object') { map.addSource(source, options.source) }
    layers.forEach(function (layer) { map.addLayer(layer) })
    // add a dummy layer that ensures the source data gets loaded
    map.addLayer({
      id: source + '-dummy',
      source: source,
      'source-layer': options['source-layer'],
      type: 'fill',
      layout: {},
      paint: { 'fill-color': '#000' },
      filter: [ 'all', [ '==', '$type', 'Polygon' ], [ '==', '$type', 'Point' ] ]
    })

    if (styleFunction.type === 'relative') {
      map.on('moveend', function () { onDataReady(updateScale) })
      onDataReady(updateScale)
    }
  })

  return layers.map(function (layer) { return layer.id })

  function updateScale () {
    var data = map.querySourceFeatures(source, {
      sourceLayer: options['source-layer'],
      filter: options.filter
    })
    .map(function (feat) { return feat.properties[styleFunction.property] })
    .sort()

    stopDataValues.map(function (q, i) {
      var value = d3array.quantile(data, q)
      styleFunction.stops[i][0] = value
    })

    stopDataValues.forEach(function (_, i) {
      map.setFilter(source + '-' + i, getFilter(options.filter, styleFunction, i))
    })

    console.log('updated dds', styleFunction)
  }

  function onDataReady (cb) {
    function onData () {
      if (!map.loaded()) { return }
      map.off('render', onData)
      cb()
    }
    map.on('render', onData)
    onData()
  }
}

function ensureStyle (map, cb) {
  if (map.loaded()) {
    cb()
  } else {
    map.once('style.load', cb)
  }
}

/**
 * @typedef {object} StyleFunction
 * @property {string} property The data property to use.
 * @property {Array} stops The "stops" for the style function; each item is an array of [datavalue, stylevalue].
 * @property {string} type Function type. Controls how data values are mapped to style values:
 - Default: a simple step function -- data values between `stops[i][0]` (inclusive) and `stops[i+1][0]` are mapped to style value `stops[i][1]`.
 - `'relative'`: Same as default, but data values in `stops` are interpreted as percentiles (between 0 and 1), and the style values are re-scaled on map move to be relative to the data that's on the screen.
 - `'categorical'`: `stops` define specific categorical values rather than ranges: `stops[i][0]` must directly match (if it's primitive) or contain (if it's an array) the feature property value.
 */

