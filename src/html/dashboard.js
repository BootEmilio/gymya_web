document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");
    const gymId = localStorage.getItem("gym_id");
  
    if (!token || !adminData) {
      // Redirigir al login si no hay sesión activa
      window.location.href = "index.html";
      return;
    }
  
    // Convertir adminData a objeto
    const admin = JSON.parse(adminData);
  
    // Mostrar datos en la página
    document.getElementById("username").textContent = admin.username;
    document.getElementById("email").textContent = admin.email;
    document.getElementById("gymId").textContent = gymId ? gymId : "No asignado";
  
    // Cerrar sesión
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.clear(); // Eliminar datos de sesión
      window.location.href = "index.html"; // Redirigir al login
    });
  });
  