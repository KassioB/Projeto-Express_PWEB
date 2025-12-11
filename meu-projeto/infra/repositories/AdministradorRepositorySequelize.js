const AdministradorRepository = require('../../domain/ports/AdministradorRepository');
const Administrador = require('../../domain/entities/Administrador');

class AdministradorRepositorySequelize extends AdministradorRepository {
  constructor(AdministradorModel) {
    super();
    this.AdministradorModel = AdministradorModel;
  }

  _rowToEntity(row) {
    if (!row) return null;
    const r = typeof row.toJSON === 'function' ? row.toJSON() : row;
    return new Administrador({ id: r.id, pessoaId: r.pessoaId });
  }

  async create(admin) {
    const row = await this.AdministradorModel.create({ pessoaId: admin.pessoaId });
    return this._rowToEntity(row);
  }

  async update(admin) {
    await this.AdministradorModel.update({ pessoaId: admin.pessoaId }, { where: { id: admin.id } });
    const row = await this.AdministradorModel.findByPk(admin.id);
    return this._rowToEntity(row);
  }

  async deleteById(id) { await this.AdministradorModel.destroy({ where: { id } }); }

  async findAll() {
    const rows = await this.AdministradorModel.findAll({ order: [['criado_em', 'DESC']] });
    return rows.map(r => this._rowToEntity(r));
  }

  async findById(id) {
    const row = await this.AdministradorModel.findByPk(Number(id));
    return this._rowToEntity(row);
  }
}

module.exports = AdministradorRepositorySequelize;
