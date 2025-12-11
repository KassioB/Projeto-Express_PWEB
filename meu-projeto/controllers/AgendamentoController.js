class AgendamentoController {
  constructor(agendamentoService, adminService, medicoService, pessoaService) {
    this.agendamentoService = agendamentoService;
    this.adminService = adminService;
    this.medicoService = medicoService;
    this.pessoaService = pessoaService;
  }

  async dashboard(req, res) {
    const medicos = await this.medicoService.listar();
    const pessoas = await this.pessoaService.listar();
    const consultas = await this.agendamentoService.listarConsultas();
    res.render('agendamento', { title: 'Agendamento', medicos, pessoas, consultas, data: {}, errors: {}, sucesso: null });
  }

  async agendar(req, res) {
    const payload = { adminId: Number(req.admin && req.admin.id), medicoId: Number(req.body.medicoId), pacienteId: Number(req.body.pacienteId), dataHora: req.body.dataHora };
    const medicos = await this.medicoService.listar();
    const pessoas = await this.pessoaService.listar();
    const consultas = await this.agendamentoService.listarConsultas();

    const errors = {};
    if (!payload.adminId) errors.geral = { msg: 'Acesso restrito a administradores.' };
    if (!payload.medicoId) errors.medicoId = { msg: 'Selecione o médico.' };
    if (!payload.pacienteId) errors.pacienteId = { msg: 'Selecione o paciente.' };
    if (!payload.dataHora) errors.dataHora = { msg: 'Informe data/hora.' };
    if (Object.keys(errors).length) {
      return res.status(400).render('agendamento', { title: 'Agendamento', medicos, pessoas, consultas, data: payload, errors, sucesso: null });
    }

    const consulta = await this.agendamentoService.agendarConsulta(payload.adminId, payload.medicoId, payload.pacienteId, payload.dataHora);
    if (!consulta) {
      const consultas2 = await this.agendamentoService.listarConsultas();
      return res.status(400).render('agendamento', { title: 'Agendamento', medicos, pessoas, consultas: consultas2, data: payload, errors: { geral: { msg: 'Falha ao agendar: admin/médico/paciente inválido ou conflito.' } }, sucesso: null });
    }
    const consultas3 = await this.agendamentoService.listarConsultas();
    res.render('agendamento', { title: 'Agendamento', medicos, pessoas, consultas: consultas3, data: {}, errors: {}, sucesso: 'Consulta agendada com sucesso.' });
  }
}

module.exports = AgendamentoController;
