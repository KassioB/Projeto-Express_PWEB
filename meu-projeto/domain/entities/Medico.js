class Medico {
  constructor({ id = null, pessoaId, crm, especialidade }) {
    this.id = id;
    this.pessoaId = pessoaId;
    this.crm = crm;
    this.especialidade = especialidade;
  }
}

module.exports = Medico;
