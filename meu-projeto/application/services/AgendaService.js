class AgendaService {
  constructor(consultaRepo) {
    this.consultaRepo = consultaRepo;
  }

  _buildGrade(date) {
    const slots = [];
    for (let h = 8; h <= 17; h++) {
      const hh = String(h).padStart(2, '0');
      slots.push(`${hh}:00`);
    }
    return slots;
  }

  async listarDisponibilidade(medicoId, dataStr) {
    const date = dataStr ? new Date(`${dataStr}T00:00:00`) : new Date();
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const consultas = await this.consultaRepo.findByMedicoAndDate(Number(medicoId), start, end);
    const byTime = new Map();
    (consultas || []).forEach(c => {
      const d = new Date(c.data);
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      byTime.set(`${hh}:${mm}`, c);
    });

    const grade = this._buildGrade(date);
    return grade.map(hora => {
      const consulta = byTime.get(hora) || null;
      return {
        hora,
        disponivel: !consulta,
        consulta: consulta ? { pacienteNome: consulta.paciente && consulta.paciente.nome, status: consulta.status } : null
      };
    });
  }
}

module.exports = AgendaService;
