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

        document.getElementById('modify-btn').addEventListener('click', () => {
            document.getElementById('modify-container').style.display = 'block';
            document.getElementById('modify-name').value = product.nombre;
            document.getElementById('modify-price').value = product.precio;
            document.getElementById('modify-size').value = product.talla;
            document.getElementById('modify-status').value = product.estado;
            document.getElementById('modify-category').value = product.clasificacion;
            document.getElementById('modify-description').value = product.descripcion;
        });

        document.getElementById('modify-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedProduct = {
                nombre: document.getElementById('modify-name').value,
                precio: document.getElementById('modify-price').value,
                talla: document.getElementById('modify-size').value,
                estado: document.getElementById('modify-status').value,
                clasificacion: document.getElementById('modify-category').value,
                descripcion: document.getElementById('modify-description').value
            };

            const updateResponse = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(updatedProduct)
            });

            if (updateResponse.ok) {
                alert('Producto actualizado exitosamente.');
                window.location.reload();
            } else {
                alert('Error al actualizar el producto');
            }
        });
    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }
});

function regresar_index() { 
    window.location.href = "../pages/index_admin.html";
}