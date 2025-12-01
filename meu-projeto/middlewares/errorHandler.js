module.exports = (err, req, res, _next) => {
  // Tratamento de validação
  if (err === 'validation_error') {
    // Se for edição (params.id presente) renderiza a view de edição, senão a criação
    if (req.params && req.params.id) {
      const data = { id: Number(req.params.id), ...req.body, aceite: req.body.aceite === 'on' };
      return res.status(400).render('contato-editar', {
        title: 'Editar Contato',
        data,
        errors: req.validationMapped || {}
      });
    }
    const data = { ...req.body, aceite: req.body.aceite === 'on' };
    return res.status(400).render('contato', {
      title: 'Formulário de Contato',
      data,
      errors: req.validationMapped || {}
    });
  }

  // Erro interno
  console.error(err);
  if (req.accepts('html')) {
    return res.status(500).render('error', { message: 'Erro interno', error: err });
  }
  res.status(500).json({ error: 'internal_error' });
};