document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
          const response = await fetch("https://api-gymya-api.onrender.com/api/Admin/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ username, password })
          });

          if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

          const data = await response.json();

          localStorage.setItem("token", data.token);
          localStorage.setItem("admin", JSON.stringify(data));
          localStorage.setItem("gym_ids", JSON.stringify(data.gym_id)); // Guardar el array de gym_id

          window.location.href = "dashboard.html"; // Redirigir al dashboard
      } catch (error) {
          console.error("Error en el login:", error);
          alert("Error al iniciar sesión. Verifica tus credenciales.");
      }
  });
});
