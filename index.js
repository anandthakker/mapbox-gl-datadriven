'use strict'

var d3array = require('d3-array')

module.exports = datadriven

/**
 * Add layers that mimic 'data-driven' style properties for Mapbox GL JS.
 *
 * @param {Map} map The mapbox-gl-js map instance
 * @param {object} options
 * @param {object|string} options.source The source id or source definition object
 * @param {string} [options.source-layer] The source layer to use -- needed for vector layers.
 * @param {string} [options.prefix] Prefix to use for source and style-layer ids that are created.
 * @param {string} options.styleProperty The paint property to style based on data values.
 * @param {object} options.styleFunction A "style function" object defining the data-value -> paint-property-value mapping.
 * @param {string} options.styleFunction.property The data property to use.
 * @param {Array} options.styleFunction.stops The "stops" for the style function; each item is an array of [datavalue, stylevalue].
 * @param {object} [options.layout] Common layout properties
 * @param {object} [options.paint] Common paint properties
 */
function datadriven (map, options) {
  var source = options.source
  var styleFunction = options.styleFunction
  var stopDataValues = styleFunction.stops.map(function (s) { return s[0] })
  ensureStyle(map, function () {
    if (typeof source === 'object') {
      source = unique(map, options.prefix)
      map.addSource(source, options.source)
    }

    styleFunction.stops.forEach(function (stop, i) {
      var styleValue = stop[1]
      var paint = {}
      paint[options.styleProperty] = styleValue
      map.addLayer({
        id: source + '-' + i,
        source: source,
        'source-layer': options['source-layer'],
        type: 'fill',
        layout: Object.assign({}, options.layout),
        paint: Object.assign(paint, options.paint),
        filter: getFilter(i)
      })
    })

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
      map.setFilter(source + '-' + i, getFilter(i))
    })

    console.log('updated dds', styleFunction)
  }

  function getFilter (i) {
    var filter = [ 'all' ]
    filter.push([ '>=', styleFunction.property, styleFunction.stops[i][0] ])
    if (i < styleFunction.stops.length - 1) {
      filter.push([ '<', styleFunction.property, styleFunction.stops[i + 1][0] ])
    }
    if (options.filter) { filter.push(options.filter) }
    return filter
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

function unique (map, prefix) {
  var baseId = prefix || 'datadriven'
  var id = baseId
  while (map.getSource(id) || map.getLayer(id)) {
    id = baseId + '-' + Math.random().toFixed(4).slice(2)
  }
  return id
}

function ensureStyle (map, cb) {
  if (map.loaded()) {
    cb()
  } else {
    map.once('style.load', cb)
  }
}
