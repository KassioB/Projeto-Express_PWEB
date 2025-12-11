const { DataTypes } = require('sequelize');

function definePessoaModel(sequelize) {
  const PessoaModel = sequelize.define('Pessoa', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(100), allowNull: false },
    cpf: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(120), allowNull: false, validate: { isEmail: true } }
  }, {
    tableName: 'pessoas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return PessoaModel;
}

module.exports = { definePessoaModel };
