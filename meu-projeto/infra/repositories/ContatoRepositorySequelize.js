const ContatoRepository = require('../../domain/ports/ContatoRepository');
const Contato = require('../../domain/entities/Contato');

class ContatoRepositorySequelize extends ContatoRepository {
  constructor(ContatoModel) {
    super();
    this.ContatoModel = ContatoModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    return new Contato({
      id: r.id,
      nome: r.nome,
      email: r.email,
      idade: r.idade,
      genero: r.genero || '',
      interesses: r.interesses ? r.interesses.split(',') : [],
      mensagem: r.mensagem,
      aceite: !!r.aceite,
      criadoEm: r.criado_em
    });
  }

  async create(contato) {
    const interesses = Array.isArray(contato.interesses) ? contato.interesses.join(',') : (contato.interesses || '');
    const row = await this.ContatoModel.create({
      nome: contato.nome,
      email: contato.email,
      idade: contato.idade || null,
      genero: contato.genero || null,
      interesses,
      mensagem: contato.mensagem,
      aceite: contato.aceite
    });
    return this._rowToEntity(row);
  }

  async update(contato) {
    const interesses = Array.isArray(contato.interesses) ? contato.interesses.join(',') : (contato.interesses || '');
    await this.ContatoModel.update({
      nome: contato.nome,
      email: contato.email,
      idade: contato.idade || null,
      genero: contato.genero || null,
      interesses,
      mensagem: contato.mensagem,
      aceite: contato.aceite
    }, { where: { id: contato.id } });

    const row = await this.ContatoModel.findByPk(contato.id);
    return this._rowToEntity(row);
  }

  async deleteById(id) {
    await this.ContatoModel.destroy({ where: { id } });
  }

  async findAll() {
    const rows = await this.ContatoModel.findAll({ order: [['criado_em', 'DESC']] });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.ContatoModel.findByPk(id);
    return this._rowToEntity(row);
  }
}

module.exports = ContatoRepositorySequelize;