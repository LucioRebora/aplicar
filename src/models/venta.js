const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VentasSchema = Schema({
    numero: Number,
    estado: String,
    creada:  {
        type: Date,
        default: Date.now
      },
    modificada:  {
        type: Date,
        default: Date.now
    },
    cliente: String,
    total : Number  
});

module.exports = mongoose.model('ventas', VentasSchema);