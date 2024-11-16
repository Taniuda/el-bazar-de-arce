document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        alert('ID de producto no encontrado');
        return;
    }

    let product;

    try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto');
        }

        product = await response.json();

        document.getElementById('product-name').textContent = product.nombre;
        document.getElementById('product-image').src = `http://localhost:3001${product.imagen}`;
        document.getElementById('product-price').textContent = product.precio;
        document.getElementById('product-size').textContent = product.talla;
        document.getElementById('product-status').textContent = product.estado;
        document.getElementById('product-category').textContent = product.clasificacion;
        document.getElementById('product-description').textContent = product.descripcion;

        // Mostrar el mensaje si el estado es diferente a disponible 
        if (product.estado !== 'disponible') { 
            document.getElementById('mensaje-compra').style.display = 'block';
        }

    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }

    const btnComprar = document.getElementById('btn-comprar');
    btnComprar.addEventListener('click', async () => {
        try {
            const total = product.precio;

            const response = await fetch('http://localhost:3001/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ producto_id: productId, total })
            });

            if (response.ok) {
                const resultado = await response.json();
                alert('Compra realizada con éxito. ID del pedido: ' + resultado.pedido_id);
                // Recargar la página para actualizar el estado del producto 
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert('Error al realizar la compra: ' + errorData.error || response.statusText);
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error);
            alert('Error al realizar la compra');
        }
    });

});

function regresar_index() { 
    window.location.href = "../index.html";
}