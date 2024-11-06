const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar tu conexión a la base de datos

// Ruta para registrar un nuevo usuario
router.post('/', async (req, res) => {
    const { nombre, email, password } = req.body;

    // Validación simple
    if (!nombre || !email || !password) {
        return res.status(400).json({ success: false, message: 'Todos los campos son requeridos.' });
    }

    try {
        // Verificar si el email ya existe
        const [results] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'El email ya está en uso.' });
        }

        // Hashear la contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // Guardar el nuevo usuario
        await db.execute('INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, passwordHash, 'usuario']);
        return res.status(201).json({ success: true, message: 'Usuario registrado con éxito.' });

    } catch (err) {
        //console.error('Error en la base de datos:', err);
        return res.status(500).json({ success: false, message: 'Error al registrar el usuario.' });
    }
});

module.exports = router;