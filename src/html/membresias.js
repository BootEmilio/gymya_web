document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = JSON.parse(localStorage.getItem("gym_id")); // gym_id es un array

    if (!token || !gymId) {
        alert("No tienes permiso para ver esta página.");
        window.location.href = "login.html";
        return;
    }

    try {
        // URL de la API con el gym_id almacenado en localStorage
        const apiUrl = `https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`;

        // Realizar la solicitud a la API
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        mostrarMembresias(data.membresias); // Función para renderizar las membresías en la UI

    } catch (error) {
        console.error("Error al obtener membresías:", error);
        alert("No se pudieron obtener las membresías.");
    }
});

function mostrarMembresias(membresias) {
    const membresiasContainer = document.getElementById("membresiasContainer");
    membresiasContainer.innerHTML = ""; // Limpiar antes de agregar nuevas

    if (membresias.length === 0) {
        membresiasContainer.innerHTML = "<p>No hay membresías activas.</p>";
        return;
    }

    membresias.forEach(membresia => {
        const membresiaElement = document.createElement("div");
        membresiaElement.classList.add("membresia-item");
        membresiaElement.innerHTML = `
            <p><strong>Usuario:</strong> ${membresia.nombre_completo}</p>
            <p><strong>Plan:</strong> ${membresia.nombre_plan}</p>
            <p><strong>Fecha de Inicio:</strong> ${new Date(membresia.fecha_inicio).toLocaleDateString()}</p>
            <p><strong>Fecha de Fin:</strong> ${new Date(membresia.fecha_fin).toLocaleDateString()}</p>
            <hr>
        `;
        membresiasContainer.appendChild(membresiaElement);
    });
}
