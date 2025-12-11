class Consulta {
  constructor({ id = null, data, status = 'agendado', medicoId, pacienteId }) {
    this.id = id;
    this.data = data;
    this.status = status;
    this.medicoId = medicoId;
    this.pacienteId = pacienteId;
  }
}

module.exports = Consulta;
