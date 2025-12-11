const { DataTypes } = require('sequelize');

function defineMedicoModel(sequelize) {
  const MedicoModel = sequelize.define('Medico', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pessoaId: { type: DataTypes.INTEGER, allowNull: false },
    crm: { type: DataTypes.STRING(30), allowNull: false },
    especialidade: { type: DataTypes.STRING(60), allowNull: false }
  }, {
    tableName: 'medicos',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return MedicoModel;
}

module.exports = { defineMedicoModel };
