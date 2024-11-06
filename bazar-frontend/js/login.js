document.getElementById('login-form').addEventListener('submit', async (event) => {
    // Previene el comportamiento predeterminado del formulario (recargar la página)
    event.preventDefault();

    // Obtiene los valores de los campos de email y password
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');

    try {
        // Realiza una solicitud POST al servidor con las credenciales de login
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }) // Convierte el email y password a formato JSON
        });

        // Convierte la respuesta del servidor a un objeto JSON
        const data = await response.json();

        if (response.ok) {
            // Muestra el mensaje de éxito
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';

            // Guardar el token en el almacenamiento local
            localStorage.setItem('token', data.token);

            // Redirigir según el rol del usuario
            if (data.rol === 'administrador') {
                window.location.href = '../pages/index_admin.html';
            } else {
                window.location.href = '../index.html';
            }
        } else {
            // Muestra el mensaje de error
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        // Muestra un mensaje de error en caso de fallo en la solicitud
        messageDiv.textContent = 'Error al intentar iniciar sesión';
        messageDiv.style.color = 'red';
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

function registroForm() {
    window.location.href = 'registro.html';
}