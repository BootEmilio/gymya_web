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
        // Enviar los datos de registro a la API
        const response = await fetch('https://api-gymya-api.onrender.com/api/admin/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Redirigiendo al pago...');

            // Llamar a la API para generar el pago
            const paymentResponse = await fetch('https://api-gymya-api.onrender.com/api/create_payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: "Membresía GymYa",
                    quantity: 1,
                    price: 500  // Ajusta el precio según tu necesidad
                }),
            });

            const paymentData = await paymentResponse.json();

            if (paymentResponse.ok) {
                // Redirigir al usuario a Mercado Pago
                window.location.href = paymentData.init_point;
            } else {
                alert(paymentData.error || 'Error al generar el pago.');
            }

        } else {
            alert(data.error || 'Error en el registro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error en el registro. Inténtalo de nuevo.');
    }
});
