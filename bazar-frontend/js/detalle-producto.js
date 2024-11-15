document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        alert('ID de producto no encontrado');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto');
        }

        const product = await response.json();

        document.getElementById('product-name').textContent = product.nombre;
        document.getElementById('product-image').src = `http://localhost:3001${product.imagen}`;
        document.getElementById('product-price').textContent = product.precio;
        document.getElementById('product-size').textContent = product.talla;
        document.getElementById('product-status').textContent = product.estado;
        document.getElementById('product-category').textContent = product.clasificacion;
        document.getElementById('product-description').textContent = product.descripcion;

    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }
});

function regresar_index() { 
    window.location.href = "../index.html";
}