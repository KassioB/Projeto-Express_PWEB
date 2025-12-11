const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');

const container = require('../container');
const PessoaController = require('../controllers/PessoaController');
const controller = new PessoaController(container.pessoaService);

router.get('/', asyncHandler(controller.listar.bind(controller)));
router.get('/novo', asyncHandler(controller.form.bind(controller)));
router.post('/', asyncHandler(controller.criar.bind(controller)));

module.exports = router;
