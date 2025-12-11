class MedicoController {
  constructor(medicoService, pessoaService) {
    this.medicoService = medicoService;
    this.pessoaService = pessoaService;
  }

  async listar(req, res) {
    const medicos = await this.medicoService.listar();
    res.render('medico-lista', { title: 'Lista de Médicos', medicos });
  }

  async form(req, res) {
    const pessoas = await this.pessoaService.listar();
    res.render('medico-novo', { title: 'Cadastrar Médico', pessoas, data: {}, errors: {} });
  }

  async cadastrar(req, res) {
    const payload = { pessoaId: Number(req.body.pessoaId), crm: req.body.crm, especialidade: req.body.especialidade };
    const errors = {};
    if (!payload.pessoaId) errors.pessoaId = { msg: 'Selecione a pessoa.' };
    if (!payload.crm) errors.crm = { msg: 'Informe o CRM.' };
    if (!payload.especialidade) errors.especialidade = { msg: 'Informe a especialidade.' };
    if (Object.keys(errors).length) {
      const pessoas = await this.pessoaService.listar();
      return res.status(400).render('medico-novo', { title: 'Cadastrar Médico', pessoas, data: payload, errors });
    }

    const medico = await this.medicoService.cadastrarMedico(payload.pessoaId, payload.crm, payload.especialidade);
    if (!medico) {
      const pessoas = await this.pessoaService.listar();
      return res.status(400).render('medico-novo', { title: 'Cadastrar Médico', pessoas, data: payload, errors: { geral: { msg: 'Pessoa inexistente ou já é médico.' } } });
    }
    res.redirect('/medicos/novo');
  }

  async agenda(req, res) {
    const medicoId = Number(req.params.id);
    const medico = await this.medicoService.obter(medicoId);
    if (!medico) return res.status(404).render('error', { message: 'Médico não encontrado', error: { status: 404, stack: '' } });
    const dataStr = req.query.data || new Date().toISOString().slice(0,10);
    const slots = await require('../container').agendaService.listarDisponibilidade(medicoId, dataStr);
    res.render('agenda-medico', { title: 'Agenda do Médico', medico, data: dataStr, slots });
  }

  async agendaPorCrm(req, res) {
    const crm = req.query.crm;
    if (!crm) return res.status(400).render('error', { message: 'Informe o CRM', error: { status: 400, stack: '' } });
    const medico = await this.medicoService.obterPorCrm(crm);
    if (!medico) return res.status(404).render('error', { message: 'Médico não encontrado', error: { status: 404, stack: '' } });
    const dataStr = req.query.data || new Date().toISOString().slice(0,10);
    const slots = await require('../container').agendaService.listarDisponibilidade(medico.id, dataStr);
    res.render('agenda-medico', { title: 'Agenda do Médico', medico, data: dataStr, slots });
  }
}

module.exports = MedicoController;
