const bcrypt = require('bcryptjs');
const Usuario = require('../../domain/entities/Usuario');

class UsuarioService {
  constructor(usuarioRepo, pessoaRepo) {
    this.usuarioRepo = usuarioRepo;
    this.pessoaRepo = pessoaRepo;
  }

  async criarUsuario(adminLogado, dados) {
    if (!adminLogado || adminLogado.role !== 'admin') throw new Error('Apenas administradores podem criar usuários');
    const pessoa = await this.pessoaRepo.findById(Number(dados.pessoaId));
    if (!pessoa) return null;
    const u = new Usuario({ login: dados.login, senha: dados.senha, role: dados.role || 'padrao', pessoaId: Number(dados.pessoaId) });
    return await this.usuarioRepo.create(u);
  }

  async autenticar(login, senhaPura) {
    const user = await this.usuarioRepo.findByLogin(login);
    if (!user) return null;
    const ok = await bcrypt.compare(senhaPura, user.senha);
    if (!ok) return null;
    return { id: user.id, login: user.login, role: user.role, pessoa: user.pessoa };
  }

  async pessoasSemUsuario() {
    const pessoas = await this.pessoaRepo.findAll();
    const todosUsuarios = await this.usuarioRepo.findAll();
    const usados = new Set(todosUsuarios.map(u => u.pessoaId));
    return pessoas.filter(p => !usados.has(p.id));
  }
}

module.exports = UsuarioService;
