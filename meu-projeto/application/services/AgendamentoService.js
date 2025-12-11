const Consulta = require('../../domain/entities/Consulta');

class AgendamentoService {
  constructor(consultaRepo, adminRepo, medicoRepo, pessoaRepo) {
    this.consultaRepo = consultaRepo;
    this.adminRepo = adminRepo;
    this.medicoRepo = medicoRepo;
    this.pessoaRepo = pessoaRepo;
  }

  async listarConsultas() {
    return await this.consultaRepo.findAll();
  }

  async agendarConsulta(adminId, medicoId, pacienteId, dataHora) {
    const admin = await this.adminRepo.findById(Number(adminId));
    if (!admin) return null;
    const medico = await this.medicoRepo.findById(Number(medicoId));
    if (!medico) return null;
    const paciente = await this.pessoaRepo.findById(Number(pacienteId));
    if (!paciente) return null;

    const conflito = await this.consultaRepo.findByMedicoAndData(Number(medicoId), new Date(dataHora));
    if (conflito) return null;

    const consulta = new Consulta({ medicoId: Number(medicoId), pacienteId: Number(pacienteId), data: new Date(dataHora), status: 'agendado' });
    return await this.consultaRepo.create(consulta);
  }
}

module.exports = AgendamentoService;
