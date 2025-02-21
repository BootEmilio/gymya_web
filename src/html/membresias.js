document.addEventListener("DOMContentLoaded", async () => {
    const gymId = localStorage.getItem("selected_gym_id");
    const token = localStorage.getItem("token");
    const membresiasList = document.getElementById("membresias-list");

    if (!gymId) {
        console.error("No se encontró gymId.");
        return;
    }

    document.getElementById("back").addEventListener("click", () => {
        window.location.href = "dashboard.html";
    });

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        // Mostrar membresías en la lista
        if (data.length === 0) {
            membresiasList.innerHTML = "<li>No hay membresías activas.</li>";
            return;
        }

        data.forEach(membresia => {
            const listItem = document.createElement("li");
            listItem.textContent = `Membresía: ${membresia.nombre} - ${membresia.tipo}`;
            membresiasList.appendChild(listItem);
        });

    } catch (error) {
        console.error("Error al obtener membresías:", error);
    }
});
