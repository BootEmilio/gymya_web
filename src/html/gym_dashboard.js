document.addEventListener("DOMContentLoaded", () => {
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

    const contentDiv = document.getElementById("content");

    document.getElementById("membresias").addEventListener("click", async () => {
        contentDiv.innerHTML = "<h3>Cargando membresías...</h3>";
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            contentDiv.innerHTML = "<h3>Membresías Activas</h3>";
            if (data.length === 0) {
                contentDiv.innerHTML += "<p>No hay membresías activas.</p>";
            } else {
                const list = document.createElement("ul");
                data.forEach(m => {
                    const item = document.createElement("li");
                    item.textContent = `Membresía: ${m.nombre} - ${m.tipo}`;
                    list.appendChild(item);
                });
                contentDiv.appendChild(list);
            }
        } catch (error) {
            contentDiv.innerHTML = `<p>Error al obtener membresías: ${error.message}</p>`;
        }
    });

    document.getElementById("usuarios").addEventListener("click", () => {
        contentDiv.innerHTML = "<h3>Gestión de Usuarios</h3><p>Aquí irá la gestión de usuarios...</p>";
    });

    document.getElementById("configuracion").addEventListener("click", () => {
        contentDiv.innerHTML = "<h3>Configuración</h3><p>Aquí irá la configuración del gimnasio...</p>";
    });
});