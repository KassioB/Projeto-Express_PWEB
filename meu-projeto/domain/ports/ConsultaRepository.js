class ConsultaRepository {
  async create(_consulta) { throw new Error('not implemented'); }
  async update(_consulta) { throw new Error('not implemented'); }
  async deleteById(_id) { throw new Error('not implemented'); }
  async findAll() { throw new Error('not implemented'); }
  async findById(_id) { throw new Error('not implemented'); }
  async findByMedicoAndData(_medicoId, _dataHora) { throw new Error('not implemented'); }
}

module.exports = ConsultaRepository;
