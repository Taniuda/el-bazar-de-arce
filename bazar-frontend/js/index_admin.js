//Conexion con el api
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
});

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

//Mostrar los productos
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

        // Añadir un enlace a la página de detalles del producto administrador
        const productLink = document.createElement('a');
        productLink.href = `pages/detalle-producto.html?id=${product.id}`;
        productLink.textContent = 'Ver detalles';
        productLink.className = 'product-link';
        productItem.appendChild(productLink);

        productList.appendChild(productItem);
    });
}

function agregar_producto() { 
    window.location.href = "../pages/agregar_producto_admin.html";
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '../pages/login.html';
}