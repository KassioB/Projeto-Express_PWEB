const Medico = require('../../domain/entities/Medico');

class MedicoService {
  constructor(medicoRepo, pessoaRepo) {
    this.medicoRepo = medicoRepo;
    this.pessoaRepo = pessoaRepo;
  }

  async cadastrarMedico(pessoaId, crm, especialidade) {
    const pessoa = await this.pessoaRepo.findById(Number(pessoaId));
    if (!pessoa) return null;
    const jaMedico = await this.medicoRepo.findByPessoaId(Number(pessoaId));
    if (jaMedico) return null;
    const medico = new Medico({ pessoaId: Number(pessoaId), crm, especialidade });
    return await this.medicoRepo.create(medico);
  }

  async listar() { return await this.medicoRepo.findAll(); }
  async obter(id) { return await this.medicoRepo.findById(Number(id)); }
  async obterPorCrm(crm) { return await this.medicoRepo.findByCrm(crm); }
}

module.exports = MedicoService;
