const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');

const container = require('../container');
const AdminController = require('../controllers/AdminController');
const controller = new AdminController(container.adminService, container.pessoaService);

router.get('/novo', asyncHandler(controller.form.bind(controller)));
router.post('/', asyncHandler(controller.promover.bind(controller)));

module.exports = router;
