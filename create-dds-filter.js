
module.exports = createDDSFilter
/**
 * Creates a style `filter` to make a layer mimic one level/stop of a
 * data-driven style.
 *
 * @param {object} prevFilter The layer's existing filter, if it exists.  If provided, the returned filter will be combined with this one.
 * @param {StyleFunction} styleFunction The style function for which data-driven should be mimicked.
 * @param {number} i The zero-based index of the level/stop to use.
 * @returns {Array} A mapbox-gl style filter.
 *
 * @example
 * var createDDSFilter = require('mapbox-gl-datadriven/create-dds-filter')
 * var filter = createDDSFilter(null, {property: 'foo', stops: [[0, 'red'], [1, 'blue'], [2, 'green']]}, 2)
 * console.log(filter)
 * // outputs: ['all', ['foo', '>=', 2]]
 */
function createDDSFilter (prevFilter, styleFunction, i) {
  var filter = [ 'all' ]
  if (styleFunction.type === 'categorical') {
    if (Array.isArray(styleFunction.stops[i][0])) {
      filter.push(['in', styleFunction.property].concat(styleFunction.stops[i][0]))
    } else {
      filter.push(['==', styleFunction.property, styleFunction.stops[i][0]])
    }
  } else {
    // assume 'interval' type
    filter.push([ '>=', styleFunction.property, styleFunction.stops[i][0] ])
    if (i < styleFunction.stops.length - 1) {
      filter.push([ '<', styleFunction.property, styleFunction.stops[i + 1][0] ])
    }
  }
  if (prevFilter) { filter.push(prevFilter) }
  return filter
}

