document.getElementById('registroForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('mensaje');

    try {
        const response = await fetch('http://localhost:3001/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.textContent = 'Registro exitoso. Ahora puedes iniciar sesión.';
            messageDiv.style.color = 'green';

            // Mostrar botón para regresar al login
            const loginButton = document.createElement('button');
            loginButton.textContent = 'Ir a Iniciar Sesión';
            loginButton.className = 'btn_ingresar';
            loginButton.onclick = () => window.location.href = 'login.html';
            messageDiv.appendChild(loginButton);

            // Limpia el formulario
            document.getElementById('registroForm').reset();
        } else {
            messageDiv.textContent = result.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        messageDiv.textContent = 'Error al registrar el usuario.';
        messageDiv.style.color = 'red';
    }
});
