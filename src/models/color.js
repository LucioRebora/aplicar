const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ColorSchema = Schema({
  color: String
});

module.exports = mongoose.model('colores', ColorSchema);
