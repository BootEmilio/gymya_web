document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const formData = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      nombre_completo: document.getElementById('nombre_completo').value,
      email: document.getElementById('email').value,
      telefono: document.getElementById('telefono').value,
    };
  
    try {
      // Llamar a la API para generar la preferencia de pago
      const paymentResponse = await fetch('https://api-gymya-api.onrender.com/api/admin/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const paymentData = await paymentResponse.json();
  
      if (paymentResponse.ok) {
        // Redirigir a la URL de Mercado Pago para completar el pago
        window.location.href = paymentData.init_point;
      } else {
        alert(paymentData.error || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error en el registro. Inténtalo de nuevo.');
    }
  });
  