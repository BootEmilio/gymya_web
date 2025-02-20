document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    let gymIds = localStorage.getItem("gym_id");
    let adminData = localStorage.getItem("admin");

    if (!token || !gymIds || !adminData) {
        alert("No tienes permiso para ver esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        gymIds = JSON.parse(gymIds);
        adminData = JSON.parse(adminData);

        if (!Array.isArray(gymIds)) {
            throw new Error("Los gym_id almacenados no son un array.");
        }

        // Crear un mapa de gym_id a nombre_gym usando los datos del administrador
        const gymMap = {};
        adminData.gimnasios.forEach(gym => {
            gymMap[gym._id] = gym.nombre; // Suponiendo que `_id` es el gym_id y `nombre` el nombre del gym
        });

        const fetchMembresias = gymIds.map(async (gymId) => {
            const apiUrl = `https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`;
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`Error HTTP ${response.status} en gym_id: ${gymId}`);
            }

            const data = await response.json();
            return { gymId, membresias: data.membresias };
        });

        const results = await Promise.all(fetchMembresias);
        const todasMembresias = results.flatMap(({ gymId, membresias }) => 
            membresias.map(m => ({ ...m, gymId, gymNombre: gymMap[gymId] || "Gimnasio Desconocido" }))
        );

        mostrarMembresias(todasMembresias);

    } catch (error) {
        console.error("Error al obtener membresías:", error);
        alert("No se pudieron obtener las membresías.");
    }
});

function mostrarMembresias(membresias) {
    const lista = document.getElementById("lista-membresias");
    lista.innerHTML = "";

    if (membresias.length === 0) {
        lista.innerHTML = "<p>No hay membresías activas.</p>";
        return;
    }

    membresias.forEach(membresia => {
        const item = document.createElement("div");
        item.classList.add("membresia");
        item.innerHTML = `
            <h3>${membresia.nombre_completo} (${membresia.username})</h3>
            <p><strong>Gimnasio:</strong> ${membresia.gymNombre}</p>
            <p><strong>Plan:</strong> ${membresia.nombre_plan}</p>
            <p><strong>Inicio:</strong> ${membresia.fecha_inicio}</p>
            <p><strong>Fin:</strong> ${membresia.fecha_fin}</p>
        `;
        lista.appendChild(item);
    });
}
