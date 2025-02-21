document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const membresiasList = document.getElementById("membresias-list");

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
        window.location.href = "dashboard.html";
        return;
    }

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Membresías obtenidas:", data);

        if (!data.membresias.length) {
            membresiasList.innerHTML = "<tr><td colspan='5'>No hay membresías activas.</td></tr>";
            return;
        }

        data.membresias.forEach(membresia => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${membresia.nombre_completo}</td>
                <td>${membresia.email}</td>
                <td>${membresia.nombre_plan}</td>
                <td>${new Date(membresia.fecha_inicio).toLocaleDateString()}</td>
                <td>${new Date(membresia.fecha_fin).toLocaleDateString()}</td>
            `;
            membresiasList.appendChild(row);
        });

    } catch (error) {
        console.error("Error al obtener membresías:", error);
        membresiasList.innerHTML = "<tr><td colspan='5' class='text-red-400'>Error al cargar las membresías.</td></tr>";
    }
});
