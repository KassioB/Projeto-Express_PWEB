const ConsultaRepository = require('../../domain/ports/ConsultaRepository');
const Consulta = require('../../domain/entities/Consulta');
const { Op } = require('sequelize');
const Medico = require('../../domain/entities/Medico');
const Pessoa = require('../../domain/entities/Pessoa');

class ConsultaRepositorySequelize extends ConsultaRepository {
  constructor(ConsultaModel, MedicoModel, PessoaModel) {
    super();
    this.ConsultaModel = ConsultaModel;
    this.MedicoModel = MedicoModel;
    this.PessoaModel = PessoaModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    const cons = new Consulta({ id: r.id, data: r.dataHora, status: r.status, medicoId: r.medicoId, pacienteId: r.pacienteId });

    if (r.Medico) {
      const med = new Medico({ id: r.Medico.id, pessoaId: r.Medico.pessoaId, crm: r.Medico.crm, especialidade: r.Medico.especialidade });
      if (r.Medico.Pessoa) {
        med.pessoa = new Pessoa({ id: r.Medico.Pessoa.id, nome: r.Medico.Pessoa.nome, cpf: r.Medico.Pessoa.cpf, telefone: r.Medico.Pessoa.telefone, email: r.Medico.Pessoa.email });
      }
      cons.medico = med;
    }

    if (r.Paciente) {
      cons.paciente = new Pessoa({ id: r.Paciente.id, nome: r.Paciente.nome, cpf: r.Paciente.cpf, telefone: r.Paciente.telefone, email: r.Paciente.email });
    }

    return cons;
  }

  async create(consulta) {
    const row = await this.ConsultaModel.create({
      medicoId: consulta.medicoId,
      pacienteId: consulta.pacienteId,
      dataHora: consulta.data,
      status: consulta.status
    });
    const withIncludes = await this.ConsultaModel.findByPk(row.id, {
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ]
    });
    return this._rowToEntity(withIncludes);
  }

  async update(consulta) {
    await this.ConsultaModel.update({
      medicoId: consulta.medicoId,
      pacienteId: consulta.pacienteId,
      dataHora: consulta.data,
      status: consulta.status
    }, { where: { id: consulta.id } });
    const row = await this.ConsultaModel.findByPk(consulta.id, {
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ]
    });
    return this._rowToEntity(row);
  }

  async deleteById(id) { await this.ConsultaModel.destroy({ where: { id } }); }

  async findAll() {
    const rows = await this.ConsultaModel.findAll({
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ],
      order: [['criado_em', 'DESC']]
    });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.ConsultaModel.findByPk(Number(id), {
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ]
    });
    return this._rowToEntity(row);
  }

  async findByMedicoAndData(medicoId, dataHora) {
    const row = await this.ConsultaModel.findOne({
      where: { medicoId, dataHora },
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ]
    });
    return this._rowToEntity(row);
  }

  async findByMedicoAndDate(medicoId, dataInicio, dataFim) {
    const rows = await this.ConsultaModel.findAll({
      where: { medicoId, dataHora: { [Op.between]: [dataInicio, dataFim] } },
      include: [
        { model: this.MedicoModel, as: 'Medico', include: [{ model: this.PessoaModel, as: 'Pessoa' }] },
        { model: this.PessoaModel, as: 'Paciente' }
      ],
      order: [['dataHora', 'ASC']]
    });
    return rows.map(r => this._rowToEntity(r));
  }
}

module.exports = ConsultaRepositorySequelize;
