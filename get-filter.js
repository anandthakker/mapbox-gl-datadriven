
module.exports = getFilter
function getFilter (prevFilter, styleFunction, i) {
  var filter = [ 'all' ]
  if (styleFunction.type === 'categorical') {
    var op = Array.isArray(styleFunction.stops[i][0]) ? 'in' : '=='
    filter.push([ op, styleFunction.property, styleFunction.stops[i][0] ])
  } else {
    filter.push([ '>=', styleFunction.property, styleFunction.stops[i][0] ])
    if (i < styleFunction.stops.length - 1) {
      filter.push([ '<', styleFunction.property, styleFunction.stops[i + 1][0] ])
    }
  }
  if (prevFilter) { filter.push(prevFilter) }
  return filter
}

