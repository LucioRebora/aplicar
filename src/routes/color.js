const express = require('express');
const router = express.Router();
const Colores = require('../models/color');

router.get('/list', async (req, res) => {
  const colores = await Colores.find().sort({"color":1});
  const color = '';
  res.render('color/list', {
    color,colores,titulo : 'Colores'
  });
});

router.post('/add', async (req, res, next) => {
    if(req.body.color != ''){
    const colores = new Colores(req.body);
    await colores.save();
    }
    res.redirect('/color/list');
});

router.get('/edit/:id', async (req, res, next) => {
    const color = await Colores.findById(req.params.id);
    const colores = await Colores.find().sort({"color":1});
    res.render('color/list', { color,colores, titulo : 'Colores' });
});

router.post('/edit/:id', async (req, res, next) => {
    if(req.body.color != ''){
    const { id } = req.params;
    await Colores.update({_id: id}, req.body);
    }
    res.redirect('/color/list');
});

router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Colores.remove({_id: id});
    res.redirect('/color/list');
  });

module.exports = router;
