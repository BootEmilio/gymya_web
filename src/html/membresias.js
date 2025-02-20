document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    let gymIds = localStorage.getItem("gym_id");

    if (!token || !gymIds) {
        alert("No tienes permiso para ver esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        gymIds = JSON.parse(gymIds);
        if (!Array.isArray(gymIds)) {
            throw new Error("Los gym_id almacenados no son un array.");
        }

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

            return response.json();
        });

        const results = await Promise.all(fetchMembresias);
        const todasMembresias = results.flatMap((res) => res.membresias);
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
            <p>Plan: ${membresia.nombre_plan}</p>
            <p>Inicio: ${membresia.fecha_inicio}</p>
            <p>Fin: ${membresia.fecha_fin}</p>
        `;
        lista.appendChild(item);
    });
}
