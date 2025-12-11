class AuthController {
  constructor(usuarioService) { this.usuarioService = usuarioService; }

  async loginForm(req, res) { res.render('login', { title: 'Login', data: {}, errors: {} }); }

  async login(req, res) {
    const { login, senha } = req.body;
    const user = await this.usuarioService.autenticar(login, senha);
    if (!user) {
      return res.status(400).render('login', { title: 'Login', data: { login }, errors: { geral: { msg: 'Credenciais inválidas' } } });
    }
    req.session.user = user;
    res.redirect('/');
  }

  async logout(req, res) { req.session.destroy(() => res.redirect('/login')); }

  async novoUsuarioForm(req, res) {
    const pessoas = await this.usuarioService.pessoasSemUsuario();
    res.render('usuario-novo', { title: 'Novo Usuário', pessoas, data: {}, errors: {} });
  }

  async criarUsuario(req, res) {
    const payload = { login: req.body.login, senha: req.body.senha, role: req.body.role, pessoaId: req.body.pessoaId };
    const errors = {};
    if (!payload.login) errors.login = { msg: 'Informe o login' };
    if (!payload.senha) errors.senha = { msg: 'Informe a senha' };
    if (!payload.pessoaId) errors.pessoaId = { msg: 'Selecione a pessoa' };
    if (Object.keys(errors).length) {
      const pessoas = await this.usuarioService.pessoasSemUsuario();
      return res.status(400).render('usuario-novo', { title: 'Novo Usuário', pessoas, data: payload, errors });
    }
    try {
      const admin = req.session.user;
      const u = await this.usuarioService.criarUsuario(admin, payload);
      if (!u) throw new Error('Falha ao criar usuário');
      res.redirect('/');
    } catch (e) {
      const pessoas = await this.usuarioService.pessoasSemUsuario();
      return res.status(400).render('usuario-novo', { title: 'Novo Usuário', pessoas, data: payload, errors: { geral: { msg: e.message || 'Erro ao criar usuário' } } });
    }
  }
}

module.exports = AuthController;
