const { DataTypes } = require('sequelize');

function defineAdministradorModel(sequelize) {
  const AdministradorModel = sequelize.define('Administrador', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    pessoaId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'administradores',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return AdministradorModel;
}

module.exports = { defineAdministradorModel };
