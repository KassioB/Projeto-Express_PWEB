const Contato = require('../../domain/entities/Contato');

class ContatoService {
  constructor(repo) { this.repo = repo; }

  async criar(payload) {
    const contato = new Contato(payload);
    return await this.repo.create(contato);
  }

  async listar() {
    return await this.repo.findAll();
  }

  async obter(id) {
    return await this.repo.findById(Number(id));
  }

  async atualizar(id, payload) {
    const atual = await this.repo.findById(Number(id));
    if (!atual) return null;
    const contato = new Contato({ ...atual, ...payload, id: Number(id) });
    return await this.repo.update(contato);
  }

  async excluir(id) {
    await this.repo.deleteById(Number(id));
  }
}

module.exports = ContatoService;