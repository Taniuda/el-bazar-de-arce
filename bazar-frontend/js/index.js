// --------------Funcion para mostrar los datos de usuario-------------
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'pages/login.html';
        return;
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

        //document.getElementById('product-name').textContent = product.nombre;
        document.getElementById('label-rol').textContent = user.rol;
        document.getElementById('label-nombre').textContent = user.nombre;
        document.getElementById('label-email').textContent = user.email;
        
    } catch (error) {
        console.error(error);
        alert('Error al cargar los datos del usuario');
    }
});

//------------------Mostrar productos y paginacion--------------------
let currentPage = 1;

async function fetchProducts(page) {
    try {
        const response = await fetch(`http://localhost:3001/api/products?page=${page}&limit=10`);
        const data = await response.json();
        displayProducts(data.productos);
        setupPagination(data.totalPages);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpia la lista antes de agregar nuevos productos

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        const productImage = document.createElement('img');
        productImage.src = `http://localhost:3001${product.imagen}`;
        productImage.alt = product.nombre;
        productImage.className = 'product-image';
        productImage.loading = 'lazy';
        productItem.appendChild(productImage);

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

function setupPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Limpia la paginación antes de agregar nuevas páginas

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-button';
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            fetchProducts(currentPage);
        });
        pagination.appendChild(pageButton);
    }
}

// Inicializar la carga de productos
fetchProducts(currentPage);
//-------------------------------------------------------------

// Función para cerrar sesión
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