'use strict'

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
  ensureStyle(map, function () {
    var source = options.source
    if (typeof source === 'object') {
      source = unique(map, options.prefix)
      map.addSource(source, options.source)
    }

    var styleFunction = options.styleFunction
    styleFunction.stops.forEach(function (stop, i) {
      var dataValue = stop[0]
      var styleValue = stop[1]

      var paint = {}
      paint[options.styleProperty] = styleValue

      var filter = [ 'all' ]
      filter.push([ '>=', styleFunction.property, dataValue ])
      if (i < styleFunction.stops.length - 1) {
        filter.push([ '<', styleFunction.property, styleFunction.stops[i + 1][0] ])
      }
      if (options.filter) { filter.push(options.filter) }

      map.addLayer({
        id: source + '-' + i,
        source: source,
        'source-layer': options['source-layer'],
        type: 'fill',
        layout: Object.assign({}, options.layout),
        paint: Object.assign(paint, options.paint),
        filter: filter
      })
    })
  })
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
