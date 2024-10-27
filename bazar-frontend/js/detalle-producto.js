document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const productDetail = document.getElementById('productDetail');

    if (!productId) {
        productDetail.textContent = 'Producto no encontrado';
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/productos/${productId}`);
        if (response.ok) {
            const product = await response.json();
            displayProductDetails(product);
        } else {
            productDetail.textContent = 'Error al cargar el producto';
        }
    } catch (error) {
        console.error('Error al conectar con la API:', error);
        productDetail.textContent = 'Error al conectar con la API';
    }
});

function displayProductDetails(product) {
    const productDetail = document.getElementById('productDetail');
    productDetail.innerHTML = `
        <h3>${product.nombre}</h3>
        <p>Precio: $${product.precio}</p>
        <p>${product.descripcion}</p>
    `;

    const buyButton = document.getElementById('buyButton');
    buyButton.addEventListener('click', () => {
        alert(`Producto ${product.nombre} agregado al carrito de compras.`);
        // Aquí podrías agregar la lógica para añadir el producto al carrito
    });
}