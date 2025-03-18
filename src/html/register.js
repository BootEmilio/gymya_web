// Configura el SDK de Mercado Pago con tu public_key
const mp = new MercadoPago('TEST-67c41580-58ac-4467-8164-9102c6835ace', {
    locale: 'es-MX', // Cambia según tu región
});

// Access token de Mercado Pago
const accessToken = "TEST-1378290191875758-031219-61e09e114ecad9a4ce02acf1b2a2e1e4-2120356194"; // Reemplaza con tu access_token

document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío tradicional del formulario

    // Obtener los datos del formulario
    const formData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        nombre_completo: document.getElementById('nombre_completo').value,
        email: document.getElementById('email').value,
        telefono: document.getElementById('telefono').value,
    };

    // Crear la preferencia de pago
    const preferenceData = {
        items: [
            {
                title: `Pago de registro para ${formData.username}`,
                unit_price: 100.0, // Precio del registro
                quantity: 1,
            },
        ],
        payer: {
            email: formData.email, // Correo del comprador
        },
        back_urls: {
            success: "https://gymya-web.onrender.com/src/html/pago_correcto.html", // URL de éxito
            failure: "https://gymya-web.onrender.com/src/html/pago_incorrecto.html", // URL de fallo
            pending: "https://gymya-web.onrender.com/src/html/pago_pendiente.html", // URL de pendiente
        },
        auto_return: "approved", // Redirigir automáticamente si el pago es aprobado
        metadata: formData, // Guardar los datos del usuario en el metadata
    };

    try {
        // Crear la preferencia de pago en Mercado Pago
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`, // Usa tu access_token
            },
            body: JSON.stringify(preferenceData),
        });

        if (!response.ok) throw new Error("Error al crear la preferencia de pago");

        const data = await response.json();

        // Abrir el checkout de Mercado Pago
        mp.checkout({
            preference: {
                id: data.id, // ID de la preferencia de pago
            },
            autoOpen: true, // Abrir automáticamente el checkout
        });
    } catch (error) {
        console.error("Error:", error);
        alert("Error al procesar el pago. Inténtalo de nuevo.");
    }
});