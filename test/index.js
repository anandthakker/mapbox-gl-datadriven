'use strict'

var test = require('tap').test
var createDDSFilter = require('../create-dds-filter')
var createLayerStack = require('../create-layer-stack')

test('createDDSFilter', function (t) {
  var styleFn = {
    property: 'foo',
    stops: [[0, 'a'], [1, 'b'], [2, 'c']]
  }
  var expectedIntervalFilter = ['all', ['>=', 'foo', 1], ['<', 'foo', 2]]
  t.same(createDDSFilter(null, styleFn, 1), expectedIntervalFilter, 'defaults to interval')
  var prevFilter = ['==', '$id', 5]
  t.same(createDDSFilter(prevFilter, styleFn, 1), expectedIntervalFilter.concat([prevFilter]), 'combine with previous')

  t.same(createDDSFilter(null, styleFn, 2), ['all', ['>=', 'foo', 2]], 'no upper bound for last stop')

  styleFn.type = 'categorical'
  t.same(createDDSFilter(null, styleFn, 1), ['all', ['==', 'foo', 1]], 'categorical')

  styleFn.stops[2] = [ ['value1', 'value2'], 'c' ]
  t.same(createDDSFilter(null, styleFn, 2), ['all', ['in', 'foo', 'value1', 'value2']], 'categorical with array value for stop level')

  t.end()
})

test('createLayerStack, paint property', function (t) {
  var styleFn = {
    property: 'foo',
    stops: [[0, 'red'], [1, 'blue']]
  }
  var layers = createLayerStack({
    styleFunction: styleFn,
    styleProperty: 'fill-color',
    source: 'my-source',
    'source-layer': 'my-layer',
    layout: { 'layout-property': 10 },
    paint: { 'fill-opacity': 0.5 },
    filter: ['existing-filter']
  })

  t.same(layers, [{
    'id': 'my-source-my-layer-0',
    'source': 'my-source',
    'source-layer': 'my-layer',
    'type': 'fill',
    'layout': {'layout-property': 10},
    'paint': {'fill-color': 'red', 'fill-opacity': 0.5},
    'filter': ['all', ['>=', 'foo', 0], ['<', 'foo', 1], ['existing-filter']]
  }, {
    'id': 'my-source-my-layer-1',
    'source': 'my-source',
    'source-layer': 'my-layer',
    'type': 'fill',
    'layout': {'layout-property': 10},
    'paint': {'fill-color': 'blue', 'fill-opacity': 0.5},
    'filter': ['all', ['>=', 'foo', 1], ['existing-filter']]
  }])

  t.end()
})

test('createLayerStack, layout property', function (t) {
  var styleFn = {
    property: 'foo',
    stops: [[0, 'red'], [1, 'blue']]
  }
  var layers = createLayerStack({
    styleFunction: styleFn,
    styleProperty: 'circle-color',
    stylePropertyType: 'layout',
    source: 'my-source',
    'source-layer': 'my-layer',
    layout: { 'layout-property': 10 },
    filter: ['existing-filter']
  })

  t.same(layers, [{
    'id': 'my-source-my-layer-0',
    'source': 'my-source',
    'source-layer': 'my-layer',
    'type': 'fill',
    'layout': {'layout-property': 10, 'circle-color': 'red'},
    'paint': {},
    'filter': ['all', ['>=', 'foo', 0], ['<', 'foo', 1], ['existing-filter']]
  }, {
    'id': 'my-source-my-layer-1',
    'source': 'my-source',
    'source-layer': 'my-layer',
    'type': 'fill',
    'layout': {'layout-property': 10, 'circle-color': 'blue'},
    'paint': {},
    'filter': ['all', ['>=', 'foo', 1], ['existing-filter']]
  }])

  t.end()
})

