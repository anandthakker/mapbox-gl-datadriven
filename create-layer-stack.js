var getFilter = require('./get-filter')
module.exports = function (options) {
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
    return {
      id: (options.prefix || options.source) + '-' + i,
      source: options.source,
      'source-layer': options['source-layer'],
      type: options.type || 'fill',
      layout: Object.assign(layout, options.layout),
      paint: Object.assign(paint, options.paint),
      filter: getFilter(options.filter, styleFunction, i)
    }
  })
  return layers
}
