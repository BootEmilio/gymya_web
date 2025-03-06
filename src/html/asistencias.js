document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const attendanceList = document.getElementById("attendanceList");
    const fetchAttendanceBtn = document.getElementById("fetchAttendanceBtn");

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    const fetchAttendances = async () => {
        const date = document.getElementById("attendanceDate").value;
        const search = document.getElementById("attendanceSearch").value;
        const url = `https://api-gymya-api.onrender.com/api/${gymId}/asistencias?fecha=${date}&search=${search}`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            console.log("Asistencias obtenidas:", data);

            if (!data.asistencias.length) {
                attendanceList.innerHTML = "<p class='text-gray-400'>No hay asistencias registradas.</p>";
                return;
            }

            attendanceList.innerHTML = data.asistencias.map(a => `
                <div class="bg-gray-800 p-4 rounded-lg shadow-lg mb-2">
                    <p><strong>Usuario:</strong> ${a.usuario}</p>
                    <p><strong>Fecha:</strong> ${a.fecha}</p>
                    <p><strong>Hora de entrada:</strong> ${a.horaEntrada}</p>
                    <p><strong>Hora de salida:</strong> ${a.horaSalida || 'Aún dentro'}</p>
                </div>
            `).join('');

        } catch (error) {
            console.error("Error al obtener las asistencias:", error);
            attendanceList.innerHTML = "<p class='text-red-400'>Error al cargar las asistencias.</p>";
        }
    };

    fetchAttendanceBtn.addEventListener("click", fetchAttendances);
    fetchAttendances();
});
