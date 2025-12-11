const { createSequelizeInstance } = require('../infra/db/sequelize');
const { definePessoaModel } = require('../infra/db/models/PessoaModel');
const { defineMedicoModel } = require('../infra/db/models/MedicoModel');
const { defineAdministradorModel } = require('../infra/db/models/AdministradorModel');
const { defineConsultaModel } = require('../infra/db/models/ConsultaModel');
const { defineUsuarioModel } = require('../infra/db/models/UsuarioModel');
const PessoaRepositorySequelize = require('../infra/repositories/PessoaRepositorySequelize');
const MedicoRepositorySequelize = require('../infra/repositories/MedicoRepositorySequelize');
const AdministradorRepositorySequelize = require('../infra/repositories/AdministradorRepositorySequelize');
const ConsultaRepositorySequelize = require('../infra/repositories/ConsultaRepositorySequelize');
const PessoaService = require('../application/services/PessoaService');
const MedicoService = require('../application/services/MedicoService');
const AdministradorService = require('../application/services/AdministradorService');
const AgendamentoService = require('../application/services/AgendamentoService');
const AgendaService = require('../application/services/AgendaService');

const dbPath = process.env.TEST_DB_PATH || undefined;
const sequelize = createSequelizeInstance(dbPath);
const PessoaModel = definePessoaModel(sequelize);
const MedicoModel = defineMedicoModel(sequelize);
const AdministradorModel = defineAdministradorModel(sequelize);
const ConsultaModel = defineConsultaModel(sequelize);
const UsuarioModel = defineUsuarioModel(sequelize);

PessoaModel.hasOne(MedicoModel, { foreignKey: 'pessoaId', as: 'Medico' });
MedicoModel.belongsTo(PessoaModel, { foreignKey: 'pessoaId', as: 'Pessoa' });

PessoaModel.hasOne(AdministradorModel, { foreignKey: 'pessoaId', as: 'Administrador' });
AdministradorModel.belongsTo(PessoaModel, { foreignKey: 'pessoaId', as: 'Pessoa' });

MedicoModel.hasMany(ConsultaModel, { foreignKey: 'medicoId', as: 'Consultas' });
ConsultaModel.belongsTo(MedicoModel, { foreignKey: 'medicoId', as: 'Medico' });

PessoaModel.hasMany(ConsultaModel, { foreignKey: 'pacienteId', as: 'ConsultasComoPaciente' });
ConsultaModel.belongsTo(PessoaModel, { foreignKey: 'pacienteId', as: 'Paciente' });

PessoaModel.hasOne(UsuarioModel, { foreignKey: 'pessoaId', as: 'Usuario' });
UsuarioModel.belongsTo(PessoaModel, { foreignKey: 'pessoaId', as: 'Pessoa' });

// export promise para os testes aguardarem
const sequelizeReady = sequelize.sync({ force: process.env.DB_FORCE_SYNC === '1' })
  .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
  .catch(err => console.error('Erro ao sincronizar Sequelize:', err));

const pessoaRepository = new PessoaRepositorySequelize(PessoaModel);
const medicoRepository = new MedicoRepositorySequelize(MedicoModel, PessoaModel);
const adminRepository = new AdministradorRepositorySequelize(AdministradorModel);
const consultaRepository = new ConsultaRepositorySequelize(ConsultaModel, MedicoModel, PessoaModel);
const UsuarioRepositorySequelize = require('../infra/repositories/UsuarioRepositorySequelize');
const UsuarioService = require('../application/services/UsuarioService');
const usuarioRepository = new UsuarioRepositorySequelize(UsuarioModel, PessoaModel);
const usuarioService = new UsuarioService(usuarioRepository, pessoaRepository);

const pessoaService = new PessoaService(pessoaRepository);
const medicoService = new MedicoService(medicoRepository, pessoaRepository);
const adminService = new AdministradorService(adminRepository, pessoaRepository);
const agendamentoService = new AgendamentoService(consultaRepository, medicoRepository, pessoaRepository);
const agendaService = new AgendaService(consultaRepository);

module.exports = {
  sequelize,
  PessoaModel,
  MedicoModel,
  AdministradorModel,
  ConsultaModel,
  UsuarioModel,
  pessoaRepository,
  medicoRepository,
  adminRepository,
  consultaRepository,
  usuarioRepository,
  pessoaService,
  medicoService,
  adminService,
  agendamentoService,
  agendaService,
  usuarioService,
  ready: sequelizeReady
};
