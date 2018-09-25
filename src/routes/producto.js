const express = require('express');
const router = express.Router();
const Tamanios = require('../models/tamanio');
const Colores = require('../models/color');
const Tipos = require('../models/tipo');
const Producto = require('../models/producto');
const dateformat = require('dateformat');

router.get('/nuevo', async (req, res) => {
    const colores = await Colores.find().sort({ "color": 1 });
    const tipos = await Tipos.find().sort({ "tipo": 1 });
    const tamanios = await Tamanios.find().sort({ "tamanio": 1 });
    const producto = new Producto();
    res.render('producto/producto', { producto, colores, tipos, tamanios, titulo: 'Productos' });
});

router.post('/add', async (req, res, next) => {
    if (req.body.stock != '') {
        const producto = new Producto(req.body);
        await producto.save();
    }
    res.redirect('/producto/list');
});

router.get('/list', async (req, res, next) => {
    const productos = await Producto.find().sort({ "codigo": 1 });
    const tipos = await Tipos.find();
    const tamanios = await Tamanios.find();
    const colores = await Colores.find();

    for (var i = 0; i < productos.length; i++) {

        for (var l = 0; l < colores.length; l++) {
            if (productos[i].colorId == colores[l]._id) {
                productos[i].color = colores[l].color;
                break;
            }
        }

        for (var k = 0; k < tamanios.length; k++) {
            if (productos[i].tamanioId == tamanios[k]._id) {
                productos[i].tamanio = tamanios[k].tamanio;
                break;
            }
        }

        for (var j = 0; j < tipos.length; j++) {
            if (productos[i].tipoId == tipos[j]._id) {
                productos[i].tipo = tipos[j].tipo;
                break;
            }
        }
    }
    res.render('producto/list', { productos, titulo: 'Productos' });
});

router.get('/edit/:id', async (req, res, next) => {
    const producto = await Producto.findById(req.params.id);
    const colores = await Colores.find().sort({ "color": 1 });
    const tipos = await Tipos.find().sort({ "tipo": 1 });
    const tamanios = await Tamanios.find().sort({ "tamanio": 1 });

    producto.color = getColorDesc(producto.colorId, colores);
    producto.tipo = getTipoDesc(producto.tipoId, tipos);
    producto.tamanio = getTamanioDesc(producto.tamanioId, tamanios);
    producto.altaDesc = dateformat(producto.alta, 'dd/mm/yyyy HH:MM:ss');

    res.render('producto/producto', { producto, colores, tipos, tamanios, titulo: 'Productos' });
});

router.post('/edit/:id', async (req, res, next) => {
    if (req.body.producto != '') {
        const { id } = req.params;
        await Producto.update({ _id: id }, req.body);
    }
    res.redirect('/producto/list');
});

router.post('/buscar', async (req, res, next) => {
    const { prod } = req.body;
    var productos = await Producto.find({ $or: [{ $where: "/" + prod + ".*/.test(this.codigo)" }, { "detalle": { $regex: '' + prod + '', $options: '-i' } }] });
    res.send(JSON.stringify(productos));
});

router.post('/buscar/pid', async (req, res, next) => {
    const { prod } = req.body;
    const producto = await Producto.findById(prod);
    res.send(producto);
});

function getTipoDesc(clave, list) {
    for (var i = 0; i < list.length; i++) {
        if (clave == list[i]._id) {
            return list[i].tipo;
        }
    }
}


function getColorDesc(clave, list) {
    for (var i = 0; i < list.length; i++) {
        if (clave == list[i]._id) {
            return list[i].color;
        }
    }
}

function getTamanioDesc(clave, list) {
    for (var i = 0; i < list.length; i++) {
        if (clave == list[i]._id) {
            return list[i].tamanio;
        }
    }
}

module.exports = (app, passport) => router;
