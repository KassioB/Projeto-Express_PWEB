const request = require('supertest');
const { buildApp } = require('../testUtils/appFactory');
const path = require('path');
const fs = require('fs');
const os = require('os');

function tmpDb() {
  return path.join(os.tmpdir(), `contatos-e2e-${Date.now()}-${Math.random()}.db`);
}

describe('Contato routes (e2e)', () => {
  let app;
  let prev;
  let dbPath;

  beforeAll(async () => {
    prev = process.env.TEST_DB_PATH;
    dbPath = tmpDb();
    process.env.TEST_DB_PATH = dbPath;
    jest.resetModules();
    app = buildApp();
    // aguarda Sequelize criar/sincronizar a tabela
    await require('../../container').ready;
  });

  afterAll(() => {
    if (prev === undefined) {
      delete process.env.TEST_DB_PATH;
    } else {
      process.env.TEST_DB_PATH = prev;
    }

    try {
      fs.unlinkSync(dbPath);
    } catch (e) {
      // não falhar se não conseguir apagar o arquivo
      console.warn('cleanup error', e);
    }
  });

  test('POST /contato cria e retorna sucesso', async () => {
    const res = await request(app)
      .post('/contato')
      .type('form')
      .send({
        nome: 'João da Silva',
        email: 'joao@example.com',
        idade: '25',
        genero: '',
        interesses: ['node','backend'],
        mensagem: 'Mensagem válida aqui!',
        aceite: 'on'
      });

    expect(res.status).toBe(200);
    expect(res.text).toContain('Enviado com sucesso');
    expect(res.text).toContain('João da Silva');
  });

  test('GET /contato/lista exibe tabela com pelo menos 1 contato', async () => {
    const res = await request(app).get('/contato/lista');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<table');
  });
});