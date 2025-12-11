class Pessoa {
  constructor({ id = null, nome, cpf, telefone, email }) {
    this.id = id;
    this.nome = nome;
    this.cpf = cpf;
    this.telefone = telefone;
    this.email = email;
  }
}

module.exports = Pessoa;
