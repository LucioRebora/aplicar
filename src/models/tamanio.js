const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TamanioSchema = Schema({
  tamanio: String
});

module.exports = mongoose.model('tamanios', TamanioSchema);