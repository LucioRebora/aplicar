const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TipoSchema = Schema({
  tipo: String
});

module.exports = mongoose.model('tipos', TipoSchema);