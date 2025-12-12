const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

function createSequelizeInstance(dbFilePath = null) {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const newDefault = path.join(dataDir, 'agenda-orm.db');
  const oldDefault = path.join(dataDir, 'contatos-orm.db');
  let storage = dbFilePath || newDefault;
  if (!dbFilePath) {
    const oldExists = fs.existsSync(oldDefault);
    const newExists = fs.existsSync(newDefault);
    if (oldExists && !newExists) {
      try {
        fs.renameSync(oldDefault, newDefault);
      } catch (_) {
        try {
          fs.copyFileSync(oldDefault, newDefault);
          storage = newDefault;
        } catch (_) {
          storage = oldDefault;
        }
      }
    }
  }

  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage,
    logging: false
  });

  return sequelize;
}

module.exports = { createSequelizeInstance };
