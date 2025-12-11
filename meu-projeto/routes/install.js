const express = require('express');
const router = express.Router();
const asyncHandler = require('../middlewares/asyncHandler');
const container = require('../container');

router.get('/', asyncHandler(async (req, res) => {
  const exists = await container.usuarioRepository.findByLogin('admin');
  if (!exists) {
    const pessoa = await container.pessoaRepository.create({ nome: 'Admin Inicial', cpf: '00000000000', telefone: '000000000', email: 'admin@local.com' });
    await container.usuarioRepository.create({ login: 'admin', senha: 'admin', role: 'admin', pessoaId: pessoa.id });
  }
  res.send('Instalação concluída. Use login: admin, senha: admin.');
}));

module.exports = router;
