//Archivo para encriptar la contraseña y cambiar el rol de un usuario
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function hashAdminPasswordAndAssignRole() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'bazar_db'
    });

    const adminPassword = 'brayan123'; // Cambia esto por la contraseña del administrador
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminEmail = 'brayan@email.com'; // Cambia esto por el correo electrónico del administrador
    const adminRole = 'administrador'; // Define el rol del administrador

    await connection.execute(
        'UPDATE usuarios SET password = ?, rol = ? WHERE email = ?',
        [hashedPassword, adminRole, adminEmail]
    );
    console.log('Contraseña del administrador hasheada y rol asignado');
    await connection.end();
}

hashAdminPasswordAndAssignRole().catch(console.error);
