const PessoaRepository = require('../../domain/ports/PessoaRepository');
const Pessoa = require('../../domain/entities/Pessoa');

class PessoaRepositorySequelize extends PessoaRepository {
  constructor(PessoaModel) {
    super();
    this.PessoaModel = PessoaModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    return new Pessoa({
      id: r.id,
      nome: r.nome,
      cpf: r.cpf,
      telefone: r.telefone,
      email: r.email
    });
  }

  async create(pessoa) {
    const row = await this.PessoaModel.create({
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      telefone: pessoa.telefone,
      email: pessoa.email
    });
    return this._rowToEntity(row);
  }

  async update(pessoa) {
    await this.PessoaModel.update({
      nome: pessoa.nome,
      cpf: pessoa.cpf,
      telefone: pessoa.telefone,
      email: pessoa.email
    }, { where: { id: pessoa.id } });
    const row = await this.PessoaModel.findByPk(pessoa.id);
    return this._rowToEntity(row);
  }

  async deleteById(id) {
    await this.PessoaModel.destroy({ where: { id } });
  }

  async findAll() {
    const rows = await this.PessoaModel.findAll({ order: [['criado_em', 'DESC']] });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.PessoaModel.findByPk(Number(id));
    return this._rowToEntity(row);
  }
}

module.exports = PessoaRepositorySequelize;
