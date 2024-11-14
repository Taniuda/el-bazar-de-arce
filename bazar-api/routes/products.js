const express = require('express');
const db = require('../db');
const { verificarToken, verificarAdministrador } = require('../routes/middleware');
const multer = require('multer'); // Importar multer para manejar la subida de archivos
const path = require('path');
const router = express.Router();

// Configurar almacenamiento de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    }
});

const upload = multer({ storage: storage });

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const [productos] = await req.db.execute('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Subir una imagen
router.post('/upload', upload.single('image'), (req, res) => {
    res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Agregar un nuevo producto (sólo administrador)
router.post('/', verificarToken, verificarAdministrador, async (req, res) => {
    const { nombre, talla, precio, clasificacion, descripcion, estado, imagen } = req.body;

    if (!nombre || !precio || !talla || !estado || !clasificacion || !descripcion) {
        return res.status(400).json({ error: 'El campo estado es obligatorio' });
    }

    try {
        await req.db.execute(
            'INSERT INTO productos (nombre, talla, precio, clasificacion, descripcion, estado, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [nombre, talla , precio , clasificacion , descripcion , estado, imagen]
        );
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Ruta para actualizar la ruta de la imagen en el producto existente para usar en pagina de actualiza_imagen.html
router.put('/updateImage/:id', verificarToken, verificarAdministrador, async (req, res) => {
    const { id } = req.params;
    const { imagePath } = req.body;

    try {
        await req.db.execute('UPDATE productos SET imagen = ? WHERE id = ?', [imagePath, id]);
        res.json({ message: 'Imagen actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la imagen:', error);
        res.status(500).json({ error: 'Error al actualizar la imagen' });
    }
});


// Editar un producto (sólo administrador)
router.put('/:id', verificarToken, verificarAdministrador, async (req, res) => {
    const { id } = req.params;
    const { nombre, talla, precio, clasificacion, descripcion, estado } = req.body;

    if (!nombre || !precio || !talla || !estado || !clasificacion || !descripcion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Actualizar los datos del producto sin modificar la imagen
        await req.db.execute(
            'UPDATE productos SET nombre = ?, talla = ?, precio = ?, clasificacion = ?, descripcion = ?, estado = ? WHERE id = ?',
            [nombre, talla, precio, clasificacion, descripcion, estado, id]
        );
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto (sólo administrador)
// router.delete('/:id', verificarToken, verificarAdministrador, async (req, res) => {
//     const { id } = req.params;
//     try {
//         await req.db.execute('DELETE FROM productos WHERE id = ?', [id]);
//         res.json({ message: 'Producto eliminado exitosamente' });
//     } catch (error) {
//         console.error('Error al eliminar el producto:', error);
//         res.status(500).json({ error: 'Error al eliminar el producto' });
//     }
// });

// Obtener un producto por su ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'ID de producto no válido' });
        }

        const [results] = await req.db.execute('SELECT * FROM productos WHERE id = ?', [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

module.exports = router;