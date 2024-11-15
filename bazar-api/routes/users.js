const express = require('express');
const { verificarToken } = require('../routes/middleware'); // Asegúrate de que tu middleware de verificación de token esté configurado correctamente
const router = express.Router();

// Ruta para obtener los datos del usuario
router.get('/me', verificarToken, async (req, res) => {
    try {
        const [result] = await req.db.execute('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [req.user.id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    }
});

module.exports = router;
