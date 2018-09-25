const express = require('express');
const router = express.Router();
const Tipos = require('../models/tipo');

router.get('/list', async (req, res) => {
  const tipos = await Tipos.find().sort({"tipo":1});
  const tipo = '';
  res.render('tipo/list', {
    tipo,tipos,titulo:'Tipos'
  });
});

router.post('/add', async (req, res, next) => {
    if(req.body.tipo != ''){
    const tipos = new Tipos(req.body);
    await tipos.save();
    }
    res.redirect('/tipo/list');
});

router.get('/edit/:id', async (req, res, next) => {
    const tipo = await Tipos.findById(req.params.id);
    const tipos = await Tipos.find().sort({"tipo":1});
    res.render('tipo/list', { tipo,tipos,titulo:'Tipos'});
});

router.post('/edit/:id', async (req, res, next) => {
    if(req.body.tipo != ''){
    const { id } = req.params;
    await Tipos.update({_id: id}, req.body);
    }
    res.redirect('/tipo/list');
});

router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Tipos.remove({_id: id});
    res.redirect('/tipo/list');
  });

module.exports = (app, passport) => router;
