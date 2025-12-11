class PessoaController {
  constructor(pessoaService) { this.pessoaService = pessoaService; }

  async listar(req, res) {
    const pessoas = await this.pessoaService.listar();
    res.render('lista-pessoas', { title: 'Lista de Pessoas', pessoas });
  }

  async form(req, res) {
    res.render('pessoa', { title: 'Nova Pessoa', data: {}, errors: {} });
  }

  async criar(req, res) {
    const payload = this._payload(req.body);
    const errors = this._validate(payload);
    if (Object.keys(errors).length) {
      return res.status(400).render('pessoa', { title: 'Nova Pessoa', data: payload, errors });
    }
    try {
      await this.pessoaService.criar(payload);
      res.redirect('/pessoas');
    } catch (e) {
      const err = { cpf: { msg: 'CPF já cadastrado ou dados inválidos.' } };
      return res.status(400).render('pessoa', { title: 'Nova Pessoa', data: payload, errors: err });
    }
  }

  _payload(body) {
    return { nome: body.nome, cpf: body.cpf, telefone: body.telefone, email: body.email };
  }

  _validate(p) {
    const errors = {};
    if (!p.nome || String(p.nome).trim().length < 3) errors.nome = { msg: 'Nome obrigatório (≥3).' };
    if (!p.cpf || String(p.cpf).trim().length < 11) errors.cpf = { msg: 'CPF obrigatório.' };
    if (!p.telefone || String(p.telefone).trim().length < 8) errors.telefone = { msg: 'Telefone obrigatório.' };
    if (!p.email || !String(p.email).includes('@')) errors.email = { msg: 'E-mail inválido.' };
    return errors;
  }
}

module.exports = PessoaController;
