// --------------Funcion para mostrar los datos de usuario-------------
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
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

    //try para obtener las ordenes del usuario
    try {
        const response = await fetch('http://localhost:3001/api/orders', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }

        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
    }

    //----------Obtencion de estadisticas---------------------
    try {
        // Fetch productos statistics
        response = await fetch('http://localhost:3001/api/products/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let productos = await response.json();
        document.getElementById('total-productos').textContent = productos.total_productos;
        document.getElementById('productos-disponibles').textContent = productos.productos_disponibles;
        document.getElementById('productos-apartados').textContent = productos.productos_apartados;
        document.getElementById('productos-vendidos').textContent = productos.productos_vendidos;

        // Fetch pedidos statistics
        response = await fetch('http://localhost:3001/api/orders/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let pedidos = await response.json();
        document.getElementById('num-ventas').textContent = pedidos.numero_ventas;
        document.getElementById('total-ventas').textContent = pedidos.total_ventas;
        document.getElementById('total-pedidos').textContent = pedidos.total_pedidos;
        document.getElementById('pedidos-pendientes').textContent = pedidos.pedidos_pendientes;
        document.getElementById('pedidos-pagados').textContent = pedidos.pedidos_pagados;
        document.getElementById('pedidos-enviados').textContent = pedidos.pedidos_enviados;
        document.getElementById('pedidos-entregados').textContent = pedidos.pedidos_entregados;
        document.getElementById('pedidos-cancelados').textContent = pedidos.pedidos_cancelados;

        // Fetch usuarios statistics
        response = await fetch('http://localhost:3001/api/user/stats', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let usuarios = await response.json();
        document.getElementById('cantidad-usuarios').textContent = usuarios.cantidad_usuarios;
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
        alert('Error al obtener las estadísticas');
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
        productLink.href = `detalle_producto_admin.html?id=${product.id}`;
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

// Funcion para abrir pagina agregar_producto
function agregar_producto() { 
    window.location.href = "../pages/agregar_producto_admin.html";
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

//-----------------------------Lista de ordenes
function displayOrders(orders) {
    const orderList = document.getElementById('orderList');
    orderList.innerHTML = ''; // Limpia la lista antes de agregar nuevos pedidos

    orders.forEach(order => {
        const orderItem = document.createElement('div');
        orderItem.className = 'product-item';

        const orderId = document.createElement('h3');
        orderId.textContent = `Pedido ID: ${order.id}`;
        orderItem.appendChild(orderId);

        const userId = document.createElement('p');
        userId.textContent = `Usuario ID: ${order.usuario_id}`;
        orderItem.appendChild(userId);

        const productId = document.createElement('p');
        productId.textContent = `Producto ID: ${order.producto_id}`;
        orderItem.appendChild(productId);

        const total = document.createElement('p');
        total.textContent = `Total: $${order.total}`;
        orderItem.appendChild(total);

        const status = document.createElement('p');
        status.textContent = `Estado: ${order.estado}`;
        orderItem.appendChild(status);

        const orderDate = document.createElement('p');
        orderDate.textContent = `Fecha: ${new Date(order.fecha).toLocaleString()}`;
        orderItem.appendChild(orderDate);

        const orderProductLink = document.createElement('a');
        orderProductLink.href = `actualiza_pedido_admin.html?id=${order.id}`;
        orderProductLink.textContent = 'Modificar pedido';
        orderProductLink.className = 'product-link';
        orderItem.appendChild(orderProductLink);

        orderList.appendChild(orderItem);
    });
}