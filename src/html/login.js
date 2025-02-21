document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Evita que el formulario se recargue
  
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("https://api-gymya-api.onrender.com/api/Admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await response.json();
        console.log("Respuesta de la API:", data);
  
        if (response.ok) {
          // Guardar en localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("admin", JSON.stringify(data.admin));
  
          // Guardar gym_id (puede ser un array, lo manejamos correctamente)
          if (Array.isArray(data.admin.gym_id)) {
            localStorage.setItem("gym_id", JSON.stringify(data.admin.gym_id));
          } else {
            localStorage.setItem("gym_id", data.admin.gym_id);
          }
  
          alert("Login exitoso");
          window.location.href = "dashboard.html"; // Redirigir a otra página después del login
        } else {
          alert(data.message || "Error en el inicio de sesión");
        }
      } catch (error) {
        console.error("Error en el login:", error);
        alert("Hubo un problema al iniciar sesión");
      }
    });
  });
  