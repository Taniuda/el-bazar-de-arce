document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3001/api/register', { // Ajusta la URL según tu configuración
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const result = await response.json();
        const mensaje = document.getElementById('mensaje');
        
        if (result.success) {
            mensaje.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
            mensaje.style.color = 'green';
            // Redireccionar o limpiar el formulario si es necesario
        } else {
            mensaje.textContent = result.message;
            mensaje.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        document.getElementById('mensaje').textContent = 'Error al registrar el usuario.';
        document.getElementById('mensaje').style.color = 'red';
    }
});


