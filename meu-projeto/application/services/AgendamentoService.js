const Consulta = require('../../domain/entities/Consulta');

class AgendamentoService {
  constructor(consultaRepo, medicoRepo, pessoaRepo) {
    this.consultaRepo = consultaRepo;
    this.medicoRepo = medicoRepo;
    this.pessoaRepo = pessoaRepo;
  }

  async listarConsultas() {
    return await this.consultaRepo.findAll();
  }

  async agendarConsulta(medicoId, pacienteId, dataHora) {
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
