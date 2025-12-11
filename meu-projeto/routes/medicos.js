const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');

const container = require('../container');
const MedicoController = require('../controllers/MedicoController');
const controller = new MedicoController(container.medicoService, container.pessoaService);

router.get('/', asyncHandler(controller.listar.bind(controller)));
router.get('/novo', asyncHandler(controller.form.bind(controller)));
router.post('/', asyncHandler(controller.cadastrar.bind(controller)));

module.exports = router;
