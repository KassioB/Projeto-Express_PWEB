class Usuario {
  constructor({ id = null, login, senha, role = 'padrao', pessoaId, pessoa = null }) {
    this.id = id;
    this.login = login;
    this.senha = senha;
    this.role = role;
    this.pessoaId = pessoaId;
    this.pessoa = pessoa || null;
  }
}

module.exports = Usuario;
