const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const Venta = require('../models/venta');
const Stocks = require('../models/stock');
const DetalleVenta = require('../models/detalleVenta');
const dateformat = require('dateformat');


router.get('/venta', async (req, res) => {
  const venta = '';
  const detalle = '';
  res.render('venta/venta',{venta, detalle,titulo : 'Venta'});
});

router.get('/list', async (req, res) => {
    const ventas = await Venta.find();

    ventas.forEach(function(venta){
      venta.creacion = dateformat(venta.creada, 'dd/mm/yyyy HH:MM:ss');
    });

    res.render('venta/list',{ ventas, titulo : 'Venta'});
});

router.post('/add', async (req, res) => {
  const {cliente} = req.body;
  const {codigo} = req.body;
  const {cantidad} = req.body;
  const {precio} = req.body;
  const {total} = req.body;
  const {talle} = req.body;
  
  const numVenta = await next();
  console.log("Creando Venta =========> "+numVenta);
  const venta = new Venta();
  venta.numero = numVenta;
  venta.estado = "Creada";
  venta.cliente = cliente;
  venta.total = total;
  const detalle = new DetalleVenta();
  detalle.numeroVenta = numVenta;
  if(Array.isArray(codigo)){
    for(var i = 0; i < codigo.length;i++){
      detalle.codigo = codigo[i];
      detalle.precio = precio[i];
      detalle.cantidad = cantidad[i];
      detalle.talle = talle[i].substring(0,talle.indexOf("-"));
      updateStock( codigo[i], detalle.talle, cantidad[i]);
    }
  }else{
    detalle.codigo = codigo;
    detalle.precio = precio;
    detalle.cantidad = cantidad;
    detalle.talle = talle.substring(0,talle.indexOf("-"));
    updateStock( codigo, detalle.talle, cantidad);
  }
  
  
  await venta.save();
  await detalle.save();
  res.redirect("/venta/venta");
});

async function updateStock(codigo, talle, cantidad){
    const stock = await Stocks.find({$and:[{"codigo":codigo},{"talle":talle}]});
    await Stocks.update({_id: stock[0]._id},{ $set :{"cantidad" : (stock[0].cantidad - cantidad)}});
};

router.get('/ver/:id', async (req, res, next) => {
  const venta = await Venta.findById(req.params.id);
  venta.creacion = dateformat(venta.creada, 'dd/mm/yyyy HH:MM:ss');
  var detalle = await DetalleVenta.find({"numeroVenta": venta.numero});
  
  for(var i = 0 ; i < detalle.length; i++){
    const producto = await Producto.find({"codigo" : detalle[i].codigo});
    detalle[i].detalle = producto[0].detalle;
  };

  res.render('venta/venta',{venta, detalle,titulo : 'Venta'});
});

async function next(){
  try{
  const venta = await Venta.find().sort({"numero":-1}).limit(1);
  return venta[0].numero + 1;
  }catch(err){
    return 1;
  };
};

module.exports = (app, passport) => router;
