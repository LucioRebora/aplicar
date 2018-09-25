const express = require('express');
const router = express.Router();
const Talles = require('../models/talle');

router.get('/list', async (req, res) => {
  const talles = await Talles.find().sort({"talle":1});
  const talle = '';
  res.render('talle/list', {
    talle,talles, titulo: 'Talles'
  });
});

router.post('/add', async (req, res, next) => {
    if(req.body.talle != ''){
    const talles = new Talles(req.body);
    await talles.save();
    }
    res.redirect('/talle/list');
});

router.get('/edit/:id', async (req, res, next) => {
    const talle = await Talles.findById(req.params.id);
    const talles = await Talles.find().sort({"talle":1});
    res.render('talle/list', { talle,talles,titulo: 'Talles' });
});

router.post('/edit/:id', async (req, res, next) => {
    if(req.body.talle != ''){
    const { id } = req.params;
    await Talles.update({_id: id}, req.body);
    }
    res.redirect('/talle/list');
});

router.get('/delete/:id', async (req, res, next) => {
    let { id } = req.params;
    await Talles.remove({_id: id});
    res.redirect('/talle/list');
  });

module.exports = router;
