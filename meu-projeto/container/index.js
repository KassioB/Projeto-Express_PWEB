const { createSequelizeInstance } = require('../infra/db/sequelize');
const { definePessoaModel } = require('../infra/db/models/PessoaModel');
const { defineMedicoModel } = require('../infra/db/models/MedicoModel');
const { defineAdministradorModel } = require('../infra/db/models/AdministradorModel');
const { defineConsultaModel } = require('../infra/db/models/ConsultaModel');
const PessoaRepositorySequelize = require('../infra/repositories/PessoaRepositorySequelize');
const MedicoRepositorySequelize = require('../infra/repositories/MedicoRepositorySequelize');
const AdministradorRepositorySequelize = require('../infra/repositories/AdministradorRepositorySequelize');
const ConsultaRepositorySequelize = require('../infra/repositories/ConsultaRepositorySequelize');
const PessoaService = require('../application/services/PessoaService');
const MedicoService = require('../application/services/MedicoService');
const AdministradorService = require('../application/services/AdministradorService');
const AgendamentoService = require('../application/services/AgendamentoService');

const dbPath = process.env.TEST_DB_PATH || undefined;
const sequelize = createSequelizeInstance(dbPath);
const PessoaModel = definePessoaModel(sequelize);
const MedicoModel = defineMedicoModel(sequelize);
const AdministradorModel = defineAdministradorModel(sequelize);
const ConsultaModel = defineConsultaModel(sequelize);

PessoaModel.hasOne(MedicoModel, { foreignKey: 'pessoaId', as: 'Medico' });
MedicoModel.belongsTo(PessoaModel, { foreignKey: 'pessoaId', as: 'Pessoa' });

PessoaModel.hasOne(AdministradorModel, { foreignKey: 'pessoaId', as: 'Administrador' });
AdministradorModel.belongsTo(PessoaModel, { foreignKey: 'pessoaId', as: 'Pessoa' });

MedicoModel.hasMany(ConsultaModel, { foreignKey: 'medicoId', as: 'Consultas' });
ConsultaModel.belongsTo(MedicoModel, { foreignKey: 'medicoId', as: 'Medico' });

PessoaModel.hasMany(ConsultaModel, { foreignKey: 'pacienteId', as: 'ConsultasComoPaciente' });
ConsultaModel.belongsTo(PessoaModel, { foreignKey: 'pacienteId', as: 'Paciente' });

// export promise para os testes aguardarem
const sequelizeReady = sequelize.sync({ force: process.env.DB_FORCE_SYNC === '1' })
  .then(() => console.log('Banco sincronizado com Sequelize (ORM).'))
  .catch(err => console.error('Erro ao sincronizar Sequelize:', err));

const pessoaRepository = new PessoaRepositorySequelize(PessoaModel);
const medicoRepository = new MedicoRepositorySequelize(MedicoModel, PessoaModel);
const adminRepository = new AdministradorRepositorySequelize(AdministradorModel);
const consultaRepository = new ConsultaRepositorySequelize(ConsultaModel, MedicoModel, PessoaModel);

const pessoaService = new PessoaService(pessoaRepository);
const medicoService = new MedicoService(medicoRepository, pessoaRepository);
const adminService = new AdministradorService(adminRepository, pessoaRepository);
const agendamentoService = new AgendamentoService(consultaRepository, adminRepository, medicoRepository, pessoaRepository);

module.exports = {
  sequelize,
  PessoaModel,
  MedicoModel,
  AdministradorModel,
  ConsultaModel,
  pessoaRepository,
  medicoRepository,
  adminRepository,
  consultaRepository,
  pessoaService,
  medicoService,
  adminService,
  agendamentoService,
  ready: sequelizeReady
};
