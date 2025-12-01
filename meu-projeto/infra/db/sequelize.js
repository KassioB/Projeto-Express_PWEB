const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

function createSequelizeInstance(dbFilePath = null) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const storage = dbFilePath || path.join(dataDir, 'contatos-orm.db');

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false
  });

  return sequelize;
}

module.exports = { createSequelizeInstance };