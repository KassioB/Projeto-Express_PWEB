const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');

const container = require('../container');
const AgendamentoController = require('../controllers/AgendamentoController');
const controller = new AgendamentoController(container.agendamentoService, container.adminService, container.medicoService, container.pessoaService);

router.get('/', asyncHandler(controller.dashboard.bind(controller)));
router.get('/novo', asyncHandler(controller.dashboard.bind(controller)));
router.post('/', asyncHandler(controller.agendar.bind(controller)));

module.exports = router;
