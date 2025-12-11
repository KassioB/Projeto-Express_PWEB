const { DataTypes } = require('sequelize');

function defineConsultaModel(sequelize) {
  const ConsultaModel = sequelize.define('Consulta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    medicoId: { type: DataTypes.INTEGER, allowNull: false },
    pacienteId: { type: DataTypes.INTEGER, allowNull: false },
    dataHora: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'agendado' }
  }, {
    tableName: 'consultas',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  return ConsultaModel;
}

module.exports = { defineConsultaModel };
