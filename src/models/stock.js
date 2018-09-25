const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = Schema({
  codigo: Number,
  talle: Number,
  cantidad: Number
});

module.exports = mongoose.model('stocks', StockSchema);
