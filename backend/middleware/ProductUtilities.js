const Product = require('../models/Product');

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get single product by ID
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { images, name, price, description, tags, brand } = req.body;
    const newProduct = new Product({ images, name, price, description, tags, brand });
    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Error creating product', error: err.message });
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted', product: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, deleteProduct };