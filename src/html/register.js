document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault();  // Evitar el envío tradicional del formulario

    // Obtener los datos del formulario
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        nombre_completo: document.getElementById('nombre_completo').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
    };

    try {
        // Enviar los datos a la API
        const response = await fetch('https://api-gymya-api.onrender.com/api/admin/pago', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Redirigiendo al login...');
            window.location.href = 'login.html';  // Redirigir al login
        } else {
            alert(data.error || 'Error en el registro');  // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro. Inténtalo de nuevo.');
    }
});