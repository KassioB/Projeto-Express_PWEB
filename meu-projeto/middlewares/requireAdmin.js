const container = require('../container');

module.exports = async (req, res, next) => {
  const id = Number(req.cookies.adminId || 0);
  if (!id) return res.redirect('/admin/novo');
  const admin = await container.adminService.obter(id);
  if (!admin) return res.redirect('/admin/novo');
  req.admin = admin;
  next();
};
