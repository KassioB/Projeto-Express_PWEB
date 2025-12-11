const Administrador = require('../../domain/entities/Administrador');

class AdministradorService {
  constructor(adminRepo, pessoaRepo) {
    this.adminRepo = adminRepo;
    this.pessoaRepo = pessoaRepo;
  }

  async promoverAdmin(pessoaId) {
    const pessoa = await this.pessoaRepo.findById(Number(pessoaId));
    if (!pessoa) return null;
    const admin = new Administrador({ pessoaId: Number(pessoaId) });
    return await this.adminRepo.create(admin);
  }

  async listar() { return await this.adminRepo.findAll(); }
  async obter(id) { return await this.adminRepo.findById(Number(id)); }
  async findByPessoaId(pessoaId) { return await this.adminRepo.findByPessoaId(Number(pessoaId)); }
}

module.exports = AdministradorService;
