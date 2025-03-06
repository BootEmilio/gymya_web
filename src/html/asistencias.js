document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const asistenciasList = document.getElementById("asistencias-list");

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
        window.location.href = "dashboard.html";
        return;
    }

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/asistencias`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Asistencias obtenidas:", data);

        if (!data.length) {
            asistenciasList.innerHTML = `
                <tr>
                    <td colspan="4" class="px-6 py-4 text-center text-gray-400">No hay asistencias registradas.</td>
                </tr>
            `;
            return;
        }

        data.forEach(asistencia => {
            const row = document.createElement("tr");
            row.className = "hover:bg-gray-700 transition duration-200";

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-purple-300">${asistencia.nombre_completo}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-purple-300">${asistencia.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-purple-300">${new Date(asistencia.fecha).toLocaleDateString()}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-purple-300">${new Date(asistencia.fecha).toLocaleTimeString()}</td>
            `;

            asistenciasList.appendChild(row);
        });

    } catch (error) {
        console.error("Error al obtener las asistencias:", error);
        asistenciasList.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center text-red-400">Error al cargar las asistencias.</td>
            </tr>
        `;
    }
});