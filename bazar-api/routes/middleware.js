const jwt = require('jsonwebtoken');

// Middleware para verificar token
function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token inválido' });
        req.user = decoded;
        next();
    });
}

// Middleware para verificar rol de administrador
function verificarAdministrador(req, res, next) {
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'Acceso denegado: Solo para administradores' });
    }
    next();
}

// Exportar las funciones de middleware
module.exports = {
    verificarToken,
    verificarAdministrador
};