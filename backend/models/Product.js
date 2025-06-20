const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  images: [{ type: String }],
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  tags: [{ type: String }],
  brand: { type: String },
});

module.exports = mongoose.model('Product', ProductSchema); 
