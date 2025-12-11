const MedicoRepository = require('../../domain/ports/MedicoRepository');
const Medico = require('../../domain/entities/Medico');
const Pessoa = require('../../domain/entities/Pessoa');

class MedicoRepositorySequelize extends MedicoRepository {
  constructor(MedicoModel, PessoaModel) {
    super();
    this.MedicoModel = MedicoModel;
    this.PessoaModel = PessoaModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    const med = new Medico({ id: r.id, pessoaId: r.pessoaId, crm: r.crm, especialidade: r.especialidade });
    if (r.Pessoa) {
      med.pessoa = new Pessoa({ id: r.Pessoa.id, nome: r.Pessoa.nome, cpf: r.Pessoa.cpf, telefone: r.Pessoa.telefone, email: r.Pessoa.email });
    }
    return med;
  }

  async create(medico) {
    const row = await this.MedicoModel.create({
      pessoaId: medico.pessoaId,
      crm: medico.crm,
      especialidade: medico.especialidade
    });
    const withPessoa = await this.MedicoModel.findByPk(row.id, { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(withPessoa);
  }

  async update(medico) {
    await this.MedicoModel.update({
      pessoaId: medico.pessoaId,
      crm: medico.crm,
      especialidade: medico.especialidade
    }, { where: { id: medico.id } });
    const row = await this.MedicoModel.findByPk(medico.id, { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }

  async deleteById(id) { await this.MedicoModel.destroy({ where: { id } }); }

  async findAll() {
    const rows = await this.MedicoModel.findAll({ include: [{ model: this.PessoaModel, as: 'Pessoa' }], order: [['criado_em', 'DESC']] });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.MedicoModel.findByPk(Number(id), { include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }

  async findByPessoaId(pessoaId) {
    const row = await this.MedicoModel.findOne({ where: { pessoaId }, include: [{ model: this.PessoaModel, as: 'Pessoa' }] });
    return this._rowToEntity(row);
  }
}

module.exports = MedicoRepositorySequelize;
