document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'pages/login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/productos', {
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

        // const productDescription = document.createElement('p');
        // productDescription.textContent = product.descripcion;
        // productItem.appendChild(productDescription);

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
