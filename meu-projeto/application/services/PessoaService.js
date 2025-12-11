const Pessoa = require('../../domain/entities/Pessoa');

class PessoaService {
  constructor(repo) { this.repo = repo; }

  async criar(payload) {
    const pessoa = new Pessoa(payload);
    return await this.repo.create(pessoa);
  }

  async listar() { return await this.repo.findAll(); }

  async obter(id) { return await this.repo.findById(Number(id)); }

  async atualizar(id, payload) {
    const atual = await this.repo.findById(Number(id));
    if (!atual) return null;
    const pessoa = new Pessoa({ ...atual, ...payload, id: Number(id) });
    return await this.repo.update(pessoa);
  }

  async excluir(id) { await this.repo.deleteById(Number(id)); }
}

module.exports = PessoaService;
