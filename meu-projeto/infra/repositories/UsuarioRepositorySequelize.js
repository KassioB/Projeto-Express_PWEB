const UsuarioRepository = require('../../domain/ports/UsuarioRepository');
const Usuario = require('../../domain/entities/Usuario');

class UsuarioRepositorySequelize extends UsuarioRepository {
  constructor(UsuarioModel, PessoaModel) {
    super();
    this.UsuarioModel = UsuarioModel;
    this.PessoaModel = PessoaModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    const u = new Usuario({ id: r.id, login: r.login, senha: r.senha, role: r.role, pessoaId: r.pessoaId });
    if (r.Pessoa) u.pessoa = r.Pessoa;
    return u;
  }

  async create(usuario) {
    const row = await this.UsuarioModel.create({ login: usuario.login, senha: usuario.senha, role: usuario.role, pessoaId: usuario.pessoaId });
    const withPessoa = await this.UsuarioModel.findByPk(row.id, { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(withPessoa);
  }

  async update(usuario) {
    await this.UsuarioModel.update({ login: usuario.login, senha: usuario.senha, role: usuario.role, pessoaId: usuario.pessoaId }, { where: { id: usuario.id } });
    const row = await this.UsuarioModel.findByPk(usuario.id, { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }

  async deleteById(id) { await this.UsuarioModel.destroy({ where: { id } }); }

  async findAll() {
    const rows = await this.UsuarioModel.findAll({ include: [{ model: this.PessoaModel, as: 'Pessoa' }], order: [['criado_em', 'DESC']] });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.UsuarioModel.findByPk(Number(id), { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }

  async findByLogin(login) {
    const row = await this.UsuarioModel.findOne({ where: { login }, include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }
}

module.exports = UsuarioRepositorySequelize;
