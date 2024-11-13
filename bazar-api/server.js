const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');
const dotenv = require('dotenv');
const loginRoutes = require('./routes/login');
const registerRoutes = require('./routes/register');
const productsRoutes = require('./routes/products');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const cors = require('cors');
app.use(cors());

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT  // Asegúrate de incluir esta línea
};

app.use(async (req, res, next) => {
    try {
        req.db = await mysql.createConnection(dbConfig);
        await req.db.connect();
        next();
    } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        res.status(500).send("Error en la conexión con la base de datos");
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

app.use('/uploads', express.static('uploads')); // Servir la carpeta de imágenes estáticas

app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/products', productsRoutes);

app.get('/', (req, res) => {
    res.send('Bienvenido al backend de tu proyecto bazar');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});