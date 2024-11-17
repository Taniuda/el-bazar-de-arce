const express = require('express');
const db = require('../db');
const { verificarToken, verificarAdministrador } = require('../routes/middleware');
const multer = require('multer'); // Importar multer para manejar la subida de archivos
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Ruta para obtener estadísticas de productos
router.get('/stats', verificarToken, verificarAdministrador, async (req, res) => {
    try {
        const [totalProductosResult] = await req.db.execute('SELECT COUNT(*) AS total_productos FROM productos');
        const [productosDisponiblesResult] = await req.db.execute('SELECT COUNT(*) AS productos_disponibles FROM productos WHERE estado = "disponible"');
        const [productosApartadosResult] = await req.db.execute('SELECT COUNT(*) AS productos_apartados FROM productos WHERE estado = "apartado"');
        const [productosVendidosResult] = await req.db.execute('SELECT COUNT(*) AS productos_vendidos FROM productos WHERE estado = "vendido"');

        res.json({
            total_productos: totalProductosResult[0].total_productos,
            productos_disponibles: productosDisponiblesResult[0].productos_disponibles,
            productos_apartados: productosApartadosResult[0].productos_apartados,
            productos_vendidos: productosVendidosResult[0].productos_vendidos
        });
    } catch (error) {
        console.error('Error al obtener las estadísticas de productos:', error);
        res.status(500).json({ error: 'Error al obtener las estadísticas de productos' });
    }
});

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
// router.get('/', async (req, res) => {
//     try {
//         const [productos] = await req.db.execute('SELECT * FROM productos');
//         res.json(productos);
//     } catch (error) {
//         console.error('Error al obtener los productos:', error);
//         res.status(500).json({ error: 'Error al obtener los productos' });
//     }
// });

// Obtener todos los productos con limite de 10
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Página actual, predeterminada a 1 si no se proporciona
    const limit = parseInt(req.query.limit) || 10; // Número de productos por página, predeterminado a 10

    const offset = (page - 1) * limit;

    try {
        const [productos] = await req.db.execute('SELECT * FROM productos LIMIT ? OFFSET ?', [limit, offset]);
        const [countResult] = await req.db.execute('SELECT COUNT(*) AS count FROM productos');
        const totalProducts = countResult[0].count;
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({ productos, totalPages });
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

// Ruta para actualizar los datos del producto sin modificar la imagen
router.put('/:id', verificarToken, verificarAdministrador, async (req, res) => {
    const { id } = req.params;
    const { nombre, talla, precio, clasificacion, descripcion, estado, imagePath } = req.body;

    if (!nombre || !precio || !talla || !estado || !clasificacion || !descripcion) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Si hay imagePath, actualiza también la imagen
        const updateQuery = imagePath
            ? 'UPDATE productos SET nombre = ?, talla = ?, precio = ?, clasificacion = ?, descripcion = ?, estado = ?, imagen = ? WHERE id = ?'
            : 'UPDATE productos SET nombre = ?, talla = ?, precio = ?, clasificacion = ?, descripcion = ?, estado = ? WHERE id = ?';

        const params = imagePath
            ? [nombre, talla, precio, clasificacion, descripcion, estado, imagePath, id]
            : [nombre, talla, precio, clasificacion, descripcion, estado, id];

        await req.db.execute(updateQuery, params);
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


// Eliminar un producto (sólo administrador)
router.delete('/:id', verificarToken, verificarAdministrador, async (req, res) => {
    const { id } = req.params;
    try {
        // Obtener la ruta de la imagen asociada
        const [result] = await req.db.execute('SELECT imagen FROM productos WHERE id = ?', [id]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const imagePath = result[0].imagen;

        // Eliminar el producto de la base de datos
        await req.db.execute('DELETE FROM productos WHERE id = ?', [id]);

        // Eliminar la imagen asociada
        if (imagePath) {
            const fullImagePath = path.join(__dirname, '..', imagePath);
            fs.unlink(fullImagePath, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen:', err);
                }
            });
        }
        res.json({ message: 'Producto eliminado exitosamente, junto con su imagen asociada' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

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

// Ruta para actualizar la ruta de la imagen en el producto existente para usar en pagina de actualiza_imagen.html
// router.put('/updateImage/:id', verificarToken, verificarAdministrador, async (req, res) => {
//     const { id } = req.params;
//     const { imagePath } = req.body;

//     try {
//         await req.db.execute('UPDATE productos SET imagen = ? WHERE id = ?', [imagePath, id]);
//         res.json({ message: 'Imagen actualizada correctamente' });
//     } catch (error) {
//         console.error('Error al actualizar la imagen:', error);
//         res.status(500).json({ error: 'Error al actualizar la imagen' });
//     }
// });

module.exports = router;