document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'pages/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/products', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            console.error('Error al obtener los productos:', response.statusText);
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
    }

    //try para obtener los datos del usuario
    try {
        const response = await fetch('http://localhost:3001/api/user/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const user = await response.json();

        document.getElementById('label-rol').textContent = user.rol;
        document.getElementById('label-nombre').textContent = user.nombre;
        document.getElementById('label-email').textContent = user.email;
        
    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos del usuario');
    }
});

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpia la lista antes de agregar nuevos productos

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productName = document.createElement('h3');
        productName.textContent = product.nombre;
        productItem.appendChild(productName);

        const productPrice = document.createElement('span');
        productPrice.textContent = `$${product.precio}`;
        productItem.appendChild(productPrice);

        // Añadir un enlace a la página de detalles del producto
        const productLink = document.createElement('a');
        productLink.href = `pages/detalle-producto.html?id=${product.id}`;
        productLink.textContent = 'Ver detalles';
        productLink.className = 'product-link';
        productItem.appendChild(productLink);

        productList.appendChild(productItem);
    });
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'pages/login.html';
}

// JavaScript para manejar las pestañas
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Desactivar todas las pestañas
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        // Activar la pestaña seleccionada
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});
