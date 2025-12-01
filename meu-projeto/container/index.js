const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineContatoModel } = require('../infra/db/models/ContatoModel');
const ContatoRepositorySequelize = require('../infra/repositories/ContatoRepositorySequelize');
const ContatoService = require('../application/services/ContatoService');

const dbPath = process.env.TEST_DB_PATH || undefined;
const sequelize = createSequelizeInstance(dbPath);
const ContatoModel = defineContatoModel(sequelize);

// export promise para os testes aguardarem
const sequelizeReady = sequelize.sync()
  .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
  .catch(err => console.error('Erro ao sincronizar Sequelize:', err));

const contatoRepository = new ContatoRepositorySequelize(ContatoModel);
const contatoService = new ContatoService(contatoRepository);

module.exports = {
  sequelize,
  ContatoModel,
  contatoRepository,
  contatoService,
  ready: sequelizeReady    // exportar promise para testes aguardarem
};