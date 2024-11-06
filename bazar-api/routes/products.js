const express = require('express');
const db = require('../db'); // Asegúrate de que tu archivo db.js esté configurado correctamente
const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        // Ejecuta la consulta para obtener todos los productos
        const [productos] = await req.db.execute('SELECT * FROM productos');
        // Responde con los productos en formato JSON
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Agregar un nuevo producto (sólo administrador)
router.post('/', async (req, res) => {
    const { nombre, talla, precio, clasificacion, descripcion } = req.body;
    try {
        // Ejecuta la consulta para insertar un nuevo producto
        await req.db.execute(
            'INSERT INTO productos (nombre, talla, precio, clasificacion, descripcion) VALUES (?, ?, ?, ?, ?)', 
            [nombre, talla, precio, clasificacion, descripcion]
        );
        // Responde con un mensaje de éxito
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Editar un producto (sólo administrador)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, talla, precio, clasificacion, descripcion } = req.body;
    try {
        // Ejecuta la consulta para actualizar un producto
        await req.db.execute(
            'UPDATE productos SET nombre = ?, talla = ?, precio = ?, clasificacion = ?, descripcion = ? WHERE id = ?',
            [nombre, talla, precio, clasificacion, descripcion, id]
        );
        // Responde con un mensaje de éxito
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Solicitud para obtener el producto con id: ${id}`); // Log adicional

    try {
        // Validar que el id sea un número entero
        if (isNaN(parseInt(id))) {
            console.log('ID de producto no válido'); // Log adicional
            return res.status(400).json({ message: 'ID de producto no válido' });
        }

        const [results] = await req.db.execute('SELECT * FROM productos WHERE id = ?', [id]);
        if (results.length === 0) {
            console.log('Producto no encontrado'); // Log adicional
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

module.exports = router;