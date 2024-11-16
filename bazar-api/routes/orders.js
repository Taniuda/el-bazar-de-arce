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
        await req.db.execute('UPDATE productos SET estado = "apartado" WHERE id = ?', [producto_id]);

        res.json({ message: 'Compra realizada con éxito', pedido_id });
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ error: 'Error al realizar la compra' });
    }
});

// Ruta para obtener todos los pedidos
router.get('/', verificarToken, async (req, res) => {
    try {
        let pedidos;
        if (req.user.rol === 'administrador') {
            // Si el usuario es administrador, obtener todos los pedidos
            [pedidos] = await req.db.execute('SELECT * FROM pedidos');
        } else {
            // Si el usuario no es administrador, obtener solo sus pedidos
            [pedidos] = await req.db.execute('SELECT * FROM pedidos WHERE usuario_id = ?', [req.user.id]);
        }
        res.json(pedidos);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

// Ruta para obtener un pedido por su ID
router.get('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [pedido] = await req.db.execute('SELECT * FROM pedidos WHERE id = ?', [id]);

        if (pedido.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.json(pedido[0]);
    } catch (error) {
        console.error('Error al obtener el pedido:', error);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});

// Ruta para actualizar el estado de un pedido por su ID
router.put('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
        return res.status(400).json({ error: 'Estado no proporcionado' });
    }

    try {
        // Actualizar el estado del pedido
        const [result] = await req.db.execute('UPDATE pedidos SET estado = ? WHERE id = ?', [estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.json({ message: 'Estado del pedido actualizado con éxito' });
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
    }
});

// Ruta para eliminar un pedido por su ID
router.delete('/:id', verificarToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await req.db.execute('DELETE FROM pedidos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.json({ message: 'Pedido eliminado con éxito' });
    } catch (error) {
        console.error('Error al eliminar el pedido:', error);
        res.status(500).json({ error: 'Error al eliminar el pedido' });
    }
});

module.exports = router;
