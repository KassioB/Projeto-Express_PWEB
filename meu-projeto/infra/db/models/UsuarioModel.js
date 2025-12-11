const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

function defineUsuarioModel(sequelize) {
  const UsuarioModel = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    login: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    senha: { type: DataTypes.STRING(120), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'medico', 'padrao'), allowNull: false, defaultValue: 'padrao' },
    pessoaId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em',
    hooks: {
      beforeCreate: async (user) => {
        if (user.senha) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('senha')) {
          const salt = await bcrypt.genSalt(10);
          user.senha = await bcrypt.hash(user.senha, salt);
        }
      }
    }
  });

  return UsuarioModel;
}

module.exports = { defineUsuarioModel };
