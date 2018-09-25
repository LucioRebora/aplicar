const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TalleSchema = Schema({
  talle: Number
});

module.exports = mongoose.model('talles', TalleSchema);
