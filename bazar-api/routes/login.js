const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Asegúrate de tener un archivo para gestionar la conexión a la BD

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Credenciales incompletas' });
    }

    try {
        const [results] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Enviar el rol junto con el token
        return res.status(200).json({ success: true, message: 'Login exitoso', token, rol: user.rol });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error en la base de datos' });
    }
});

module.exports = router;