'use strict'

module.exports = datadriven

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
