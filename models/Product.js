const mongoose = require('mongoose')

// name
// size - String
// color frame [enum]
// color lence [enum]
// material frame [enum]
// material lence [enum]
// price - number
// originaPrice - number
// shape [enum]
// gender [enum]
// weight String

const ProductSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    size: {
      type: String,
      required: [true, 'Please provide a product size'],
    },
    weight: {
      type: String,
      required: [true, 'Please provide a product weight'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'both'],
      default: 'both',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Product', ProductSchema)
