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

            const nombre = document.getElementById('modify-name').value;
            const precio = document.getElementById('modify-price').value;
            const talla = document.getElementById('modify-size').value;
            const estado = document.getElementById('modify-status').value;
            const clasificacion = document.getElementById('modify-category').value;
            const descripcion = document.getElementById('modify-description').value;
            const imagenElement = document.getElementById('foto_producto');
            const token = localStorage.getItem('token');

            let imagePath = null;

            if (imagenElement.files.length > 0) {
                // Subir la imagen primero
                const formData = new FormData();
                formData.append('image', imagenElement.files[0]);

                const uploadResponse = await fetch('http://localhost:3001/api/products/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData
                });

                const uploadData = await uploadResponse.json();

                if (!uploadResponse.ok) {
                    alert('Error al subir la imagen: ' + (uploadData.error || uploadResponse.statusText));
                    return;
                }

                imagePath = uploadData.filePath;
            }

            const updatedProduct = {
                nombre,
                precio,
                talla,
                estado,
                clasificacion,
                descripcion,
                imagePath
            };

            const updateResponse = await fetch(`http://localhost:3001/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedProduct)
            });

            const updateData = await updateResponse.json();

            if (updateResponse.ok) {
                alert('Producto actualizado exitosamente.');
                window.location.reload();
            } else {
                alert('Error al actualizar el producto: ' + (updateData.error || updateResponse.statusText));
            }
        });

        document.getElementById('delete-btn').addEventListener('click', async () => {
            if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                return;
            }

            const deleteResponse = await fetch(`http://localhost:3001/api/products/${productId}`, {
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

    } catch (error) {
        console.error(error);
        alert('Error al cargar los detalles del producto');
    }
});


function regresar_index() { 
    window.location.href = "../pages/index_admin.html";
}