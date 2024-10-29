// Middleware para verificar token y rol de administrador
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token no proporcionado' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Token inválido' });
      req.user = decoded;
      next();
    });
  }
  
  function verificarAdministrador(req, res, next) {
    if (req.user.rol !== 'administrador') {
      return res.status(403).json({ message: 'Acceso denegado: Solo para administradores' });
    }
    next();
  }