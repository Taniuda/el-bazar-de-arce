document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('login-message');

    try {
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'green';
            // Guardar el token y redirigir a la página principal
            localStorage.setItem('token', data.token);
            window.location.href = '../index.html';
        } else {
            messageDiv.textContent = data.message;
            messageDiv.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        messageDiv.textContent = 'Error al intentar iniciar sesión';
        messageDiv.style.color = 'red';
    }
});

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}