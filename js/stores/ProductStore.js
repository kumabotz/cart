var AppDispatcher = require('../dispatcher/AppDispatcher')
var EventEmitter = require('events').EventEmitter
var FluxCartConstants = require('../constants/FluxCartConstants')
var _ = require('underscore')

// define initial data points
var _product = {}
var _selected = null

// method to load product data from mock API
function loadProductData(data) {
  _product = data[0]
  _selected = data[0].variants[0]
}

// method to set the currently selected product variantion
function setSelected(index) {
  _selected = _product.variants[index]
}

// extend ProductStore with EventEmitter to add eventing capabilities
var ProductStore = _.extend({}, EventEmitter.prototype, {
  // return Product data
  getProduct: function() {
    return _product
  },

  // return selected product
  getSelected: function() {
    return _selected
  },

  // emit change event
  emitChange: function() {
    this.emit('change')
  },

  // add change listener
  addChangeListener: function(callback) {
    this.on('change', callback)
  },

  // remove change listener
  removeChangeListener: function(callback) {
    this.removeListener('change', callback)
  }
})

// register callback with AppDispatcher
AppDispatcher.register(function(payload) {
  var action = payload.action

  switch (action.actionType) {
    // respond to RECEIVE_DATA action
    case FluxCartConstants.RECEIVE_DATA:
      loadProductData(action.data)
      break

    // respond to SELECT_PRODUCT action
    case FluxCartConstants.SELECT_PRODUCT:
      setSelected(action.data)
      break

    default:
      return true
  }

  // if action was responded to, emit change event
  ProductStore.emitChange()

  return true
})

module.exports = ProductStore
