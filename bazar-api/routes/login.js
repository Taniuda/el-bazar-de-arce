const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db'); // Asegúrate de tener un archivo para gestionar la conexión a la BD

router.post('/', async (req, res) => {
    const { email, password } = req.body;
    //console.log('Email:', email, 'Password:', password); // Log de las credenciales

    if (!email || !password) {
        //console.log('Credenciales incompletas');
        return res.status(400).json({ success: false, message: 'Credenciales incompletas' });
    }

    try {
        const [results] = await req.db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (results.length === 0) {
            //console.log('Usuario no encontrado');
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password); // Usa compare en lugar de compareSync
        //console.log('Password match:', passwordMatch);

        if (!passwordMatch) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });
        //console.log('Token generado:', token);
        res.status(200).json({ success: true, message: 'Login exitoso', token });
    } catch (err) {
        //console.error('Error en la base de datos:', err);
        res.status(500).json({ success: false, message: 'Error en la base de datos' });
    }
});

module.exports = router;