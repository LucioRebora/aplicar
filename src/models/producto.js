const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductoSchema = Schema({
    codigo: Number,
    estado: String,
    tamanioId: String,
    colorId: String,
    tipoId: String,
    detalle: String,
    precioOsaina: Number,
    precioNuevo: Number,
    costo: Number,
    descuento: Number,
    alta:  {
        type: Date,
        default: Date.now
      }
});

module.exports = mongoose.model('productos', ProductoSchema);