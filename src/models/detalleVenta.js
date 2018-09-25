const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetalleVentasSchema = Schema({
    numeroVenta : Number,
    codigo: Number,
    precio: Number,
    talle: Number,
    cantidad : Number
});

module.exports = mongoose.model('detalleVentas', DetalleVentasSchema);