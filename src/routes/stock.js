const express = require('express');
const router = express.Router();
const Stocks = require('../models/stock');
const Producto = require('../models/producto');
const Talle = require('../models/talle');

router.get('/list', async (req, res) => {
    const stocks = await Stocks.find().sort({ "stock": 1 });
    const productos = await Producto.find();
    const talles = await Talle.find().sort({ "talle": 1 });
    res.render('stock/list', {
        stocks, productos, talles, titulo: 'Stock'
    });
});

router.get('/edit/:id', async (req, res, next) => {
    const producto = await Producto.findById(req.params.id);
    var talles = await Talle.find().sort({ "talle": 1 });
    const stock = new Stocks();
    for (var i = 0; i < talles.length; i++) {
        const stk = await Stocks.find({ codigo: producto.codigo, talle: talles[i].talle });
        if (stk != '') {
            talles[i].cantidad = stk[0].cantidad;
        }
    }
    res.render('stock/stock', { stock, talles, producto, titulo: 'Stock' });
});

router.post('/edit/:codigo', async (req, res, next) => {
    const { codigo } = req.params;
    for (var prop in req.body) {
        if (req.body[prop].length > 0) {
            const ta = prop;
            const ca = req.body[prop];
            const stock = await Stocks.find({ codigo: codigo, talle: ta });
            if (stock == '') {
                await new Stocks({ codigo: codigo, talle: ta, cantidad: ca }).save();
            } else {
                await Stocks.update({ codigo: codigo, talle: ta }, { cantidad: ca });
            }
        }
    }
    res.redirect('/producto/list');
});

router.post('/buscar/pid', async (req, res, next) => {
    const { cod } = req.body;
    const stock = await Stocks.find(({ $and: [{ "codigo": cod }, { "cantidad": { $gt: 0 } }] }));

    res.send(JSON.stringify(stock));
});

module.exports = router;
