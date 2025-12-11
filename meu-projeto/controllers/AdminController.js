class AdminController {
  constructor(adminService, pessoaService) {
    this.adminService = adminService;
    this.pessoaService = pessoaService;
  }

  async form(req, res) {
    const pessoas = await this.pessoaService.listar();
    res.render('admin-novo', { title: 'Promover Administrador', pessoas, data: {}, errors: {} });
  }

  async promover(req, res) {
    const payload = { pessoaId: Number(req.body.pessoaId) };
    const errors = {};
    if (!payload.pessoaId) errors.pessoaId = { msg: 'Selecione a pessoa.' };
    if (Object.keys(errors).length) {
      const pessoas = await this.pessoaService.listar();
      return res.status(400).render('admin-novo', { title: 'Promover Administrador', pessoas, data: payload, errors });
    }
    const admin = await this.adminService.promoverAdmin(payload.pessoaId);
    if (!admin) {
      const pessoas = await this.pessoaService.listar();
      return res.status(400).render('admin-novo', { title: 'Promover Administrador', pessoas, data: payload, errors: { geral: { msg: 'Pessoa inexistente.' } } });
    }
    res.cookie('adminId', String(admin.id), { httpOnly: true });
    res.redirect('/agendamento');
  }
}

module.exports = AdminController;
