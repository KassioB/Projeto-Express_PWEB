const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const container = require('../container');
const AuthController = require('../controllers/AuthController');
const controller = new AuthController(container.usuarioService);

router.get('/login', asyncHandler(controller.loginForm.bind(controller)));
router.post('/login', asyncHandler(controller.login.bind(controller)));
router.get('/logout', asyncHandler(controller.logout.bind(controller)));

router.get('/usuarios/novo', isAuthenticated, isAdmin, asyncHandler(controller.novoUsuarioForm.bind(controller)));
router.post('/usuarios', isAuthenticated, isAdmin, asyncHandler(controller.criarUsuario.bind(controller)));

module.exports = router;
