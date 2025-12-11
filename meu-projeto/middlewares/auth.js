function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) return next();
  if (req.path === '/login' || req.path === '/logout') return next();
  return res.redirect('/login');
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === 'admin') return next();
  return res.status(403).render('error', { message: 'Acesso negado', error: { status: 403, stack: '' } });
}

module.exports = { isAuthenticated, isAdmin };
