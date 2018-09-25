const express = require('express');
const router = express.Router();
const Tamanios = require('../models/tamanio');

router.get('/list', async (req, res) => {
  const tamanios = await Tamanios.find().sort({"tamanio":1});
  const tamanio = '';
  res.render('tamanio/list', {
    tamanio,tamanios,titulo:'Tamaños'
  });
});

router.post('/add', async (req, res, next) => {
    if(req.body.tamanio != ''){
    const tamanios = new Tamanios(req.body);
    await tamanios.save();
    }
    res.redirect('/tamanio/list');
});

router.get('/edit/:id', async (req, res, next) => {
    const tamanio = await Tamanios.findById(req.params.id);
    const tamanios = await Tamanios.find().sort({"tamanio":1});
    res.render('tamanio/list', { tamanio,tamanios, titulo:'Tamaños'});
});

router.post('/edit/:id', async (req, res, next) => {
    if(req.body.tamanio != ''){
    const { id } = req.params;
    await Tamanios.update({_id: id}, req.body);
    }
    res.redirect('/tamanio/list');
});

router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Tamanios.remove({_id: id});
    res.redirect('/tamanio/list');
  });

module.exports = (app, passport) => router;
