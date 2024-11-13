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
        const nombre = document.querySelector('textarea[placeholder="Nombre del producto"]').value;
        const precio = document.querySelector('textarea[placeholder="Precio"]').value;
        const talla = document.querySelector('select[name="talla"]').value;
        const estado = document.querySelector('select[name="estado"]').value;
        const clasificacion = document.querySelector('select[name="categoria"]').value;
        const descripcion = document.querySelector('textarea[placeholder="Descripcion"]').value;
        const token = localStorage.getItem('token');

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

        // Creación del objeto de producto
        const nuevoProducto = {
            nombre,
            talla,
            precio,
            clasificacion,
            descripcion,
            estado
        };

        try {
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
                nombre.value = '';
                precio.value = '';
                talla.value = '';
                estado.value = '';
                clasificacion.value = '';
                descripcion.value = '';

            } else {
                alert('Error al agregar producto: ' + (data.error || response.statusText));
            }
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            alert('Error al agregar el producto.');
        }
    });
});
