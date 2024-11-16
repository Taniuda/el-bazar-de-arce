const express = require('express');
const { verificarToken } = require('../routes/middleware');
const db = require('../db');
const router = express.Router();

// Ruta para realizar una compra
router.post('/', verificarToken, async (req, res) => {
    const { producto_id, total } = req.body;
    const usuario_id = req.user.id;

    if (!producto_id || !total) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }

    try {
        // Verificar que el producto esté disponible
        const [producto] = await req.db.execute('SELECT estado FROM productos WHERE id = ?', [producto_id]);
        if (producto.length === 0 || producto[0].estado !== 'disponible') {
            return res.status(400).json({ error: 'Producto no disponible' });
        }

        // Crear el pedido
        const [pedidoResult] = await req.db.execute('INSERT INTO pedidos (usuario_id, producto_id, total, estado) VALUES (?, ?, ?, "Pendiente")', [usuario_id, producto_id, total]);
        const pedido_id = pedidoResult.insertId;

        // Marcar el producto como pendiente
        await req.db.execute('UPDATE productos SET estado = "pendiente" WHERE id = ?', [producto_id]);

        res.json({ message: 'Compra realizada con éxito', pedido_id });
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ error: 'Error al realizar la compra' });
    }
});

// Ruta para obtener todos los pedidos
router.get('/', verificarToken, async (req, res) => {
    try {
        const [pedidos] = await req.db.execute('SELECT * FROM pedidos');
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

module.exports = router;
