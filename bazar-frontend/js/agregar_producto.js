document.addEventListener('DOMContentLoaded', () => {
    
    const btnSalir = document.querySelector('.boton_salir');
    btnSalir.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = '../pages/index_admin.html';
    });
    
    const btnGuardar = document.querySelector('.boton_guardar');
    btnGuardar.addEventListener('click', async (event) => {
        event.preventDefault();

        // Extracción de datos del formulario
        const nombreElement = document.getElementById('nombre');
        const precioElement = document.getElementById('precio');
        const tallaElement = document.getElementById('talla');
        const estadoElement = document.getElementById('estado');
        const clasificacionElement = document.getElementById('clasificacion');
        const descripcionElement = document.getElementById('descripcion');
        const imagenElement = document.getElementById('foto_producto');
        const token = localStorage.getItem('token');

        const nombre = nombreElement.value;
        const precio = precioElement.value;
        const talla = tallaElement.value;
        const estado = estadoElement.value;
        const clasificacion = clasificacionElement.value;
        const descripcion = descripcionElement.value;

        // Validación de datos
        if (!nombre || !precio || !talla || !estado || !clasificacion || !descripcion) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Validación del token
        if (!token) {
            alert("No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.");
            return;
        }

        try {
            // Subir imagen
            const formData = new FormData();
            formData.append('image', imagenElement.files[0]);

            const imageResponse = await fetch('http://localhost:3001/api/products/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const imageData = await imageResponse.json();

            if (!imageResponse.ok) {
                alert('Error al subir la imagen: ' + (imageData.error || imageResponse.statusText));
                return;
            }

            // Creación del objeto de producto
            const nuevoProducto = {
                nombre,
                talla,
                precio,
                clasificacion,
                descripcion,
                estado,
                imagen: imageData.filePath // Ruta de la imagen
            };

            // Envío de datos a la API
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Asegúrate de que el token está en el localStorage
                },
                body: JSON.stringify(nuevoProducto)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Producto agregado exitosamente.');

                // Limpiar los datos del formulario
                nombreElement.value = '';
                precioElement.value = '';
                tallaElement.value = '';
                estadoElement.value = '';
                clasificacionElement.value = '';
                descripcionElement.value = '';
                imagenElement.value = '';
                
                // Opcional: Recargar la página después de cierto tiempo
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);

            } else {
                alert('Error al agregar producto: ' + (data.error || response.statusText));
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            alert('Error al agregar el producto.');
        }
    });
});