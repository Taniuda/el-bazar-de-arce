document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const pedidoId = params.get('id');

    var productId;

    if (!pedidoId) {
        alert('ID de pedido no encontrado');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/api/orders/${pedidoId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los detalles del producto');
        }

        const order = await response.json();

        document.getElementById('order_id').textContent = order.id;
        document.getElementById('user_id').textContent = order.usuario_id;
        document.getElementById('product_id').textContent = order.producto_id;
        document.getElementById('order_total').textContent = order.total;
        document.getElementById('order-status').textContent = order.estado;
        document.getElementById('order-date').textContent = new Date(order.fecha).toLocaleString();

        productId = order.producto_id;
    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }
    
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

        // Mostrar el mensaje si el estado es diferente a disponible 
        if (product.estado !== 'disponible') { 
            document.getElementById('mensaje-compra').style.display = 'block';
        }

        document.getElementById('modify-btn').addEventListener('click', () => {
            document.getElementById('modify-container').style.display = 'block';
            document.getElementById('modify-status').value = product.estado;
        });

        document.getElementById('modify-form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const id = document.getElementById('order_id').textContent;
            const estado = document.getElementById('modify-status').value;
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ estado })
                });
        
                if (response.ok) {
                    const result = await response.json();
                    alert('Estado del pedido actualizado con éxito');
                    window.location.reload();
                } else {
                    alert('Error al actualizar el estado del pedido: ' + response.statusText);
                }
            } catch (error) {
                console.error('Error al actualizar el estado del pedido:', error);
                alert('Error al actualizar el estado del pedido');
            }
        });

    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }

    document.getElementById('delete-btn').addEventListener('click', async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
            return;
        }

        const deleteResponse = await fetch(`http://localhost:3001/api/orders/${pedidoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (deleteResponse.ok) {
            alert('Producto eliminado exitosamente.');
            window.location.href = '../pages/index_admin.html';
        } else {
            const data = await deleteResponse.json();
            alert('Error al eliminar el producto: ' + (data.error || deleteResponse.statusText));
            window.location.href = '../pages/index_admin.html';
        }
    });

});


function regresar_index() { 
    window.location.href = "../pages/index_admin.html";
}