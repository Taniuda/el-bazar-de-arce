document.addEventListener('DOMContentLoaded', () => {
    const btnActualizarImagen = document.getElementById('actualizar-imagen-btn');

    btnActualizarImagen.addEventListener('click', async (event) => {
        event.preventDefault();

        const productId = document.getElementById('product-id').value;
        const imagenElement = document.getElementById('foto_producto');
        const token = localStorage.getItem('token');

        if (!productId || !imagenElement.files.length) {
            alert('Por favor, seleccione un producto e imagen para actualizar.');
            return;
        }

        try {
            // Paso 1: Subir imagen
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

            const imagePath = uploadData.filePath;

            // Paso 2: Actualizar la ruta de la imagen en el producto
            const updateResponse = await fetch(`http://localhost:3001/api/products/updateImage/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ imagePath })
            });

            const updateData = await updateResponse.json();

            if (updateResponse.ok) {
                alert('Imagen actualizada exitosamente.');
            } else {
                alert('Error al actualizar la imagen: ' + (updateData.error || updateResponse.statusText));
            }
        } catch (error) {
            console.error('Error al actualizar la imagen:', error);
            alert('Error al actualizar la imagen.');
        }
    });
});