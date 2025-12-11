var express = require('express');
var router = express.Router();
const container = require('../container');

/* GET home page. */
router.get('/', async function(req, res) {
  const medicos = await container.medicoService.listar();
  res.render('index', { title: 'Minha Aplicação', medicos });
});

module.exports = router;
