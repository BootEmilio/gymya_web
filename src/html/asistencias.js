document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const asistenciaList = document.getElementById("asistencias-list");
    const fechaFiltro = document.getElementById("fechaFiltro");
    const buscarFechaBtn = document.getElementById("buscarFechaBtn");

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    // Obtener la fecha actual en formato YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0'); 
        return `${year}-${month}-${day}`;
    };

    // Mostrar asistencias más recientes al cargar la página
    const fetchAttendances = async (selectedDate = getTodayDate()) => {
        const url = `https://api-gymya-api.onrender.com/api/${gymId}/asistencias?fecha=${selectedDate}&page=1&limit=20`;

        try {
            const response = await fetch(url, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            console.log("Asistencias obtenidas:", data);

            if (!data.asistencias || data.asistencias.length === 0) {
                asistenciaList.innerHTML = "<tr><td colspan='4' class='text-center text-gray-400 p-4'>No hay asistencias registradas para esta fecha.</td></tr>";
                return;
            }

            asistenciaList.innerHTML = data.asistencias.map(usuario => {
                if (!usuario.asistencias || usuario.asistencias.length === 0) {
                    return `
                        <tr>
                            <td class="px-6 py-4">${usuario.nombre_completo}</td>
                            <td class="px-6 py-4 text-center" colspan="3">Sin registros</td>
                        </tr>`;
                }

                return usuario.asistencias.map(asistencia => `
                    <tr class="hover:bg-gray-700 transition">
                        <td class="px-6 py-4">${usuario.nombre_completo}</td>
                        <td class="px-6 py-4">${asistencia.entrada.split('T')[0]}</td>
                        <td class="px-6 py-4">${asistencia.entrada.split('T')[1].slice(0, 5)}</td>
                        <td class="px-6 py-4">${asistencia.salida === "Aún en el gimnasio" ? '---' : asistencia.salida.split('T')[1].slice(0, 5)}</td>
                    </tr>
                `).join('');
            }).join('');

        } catch (error) {
            console.error("Error al obtener las asistencias:", error);
            asistenciaList.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-red-400 p-4">
                        Error al cargar las asistencias: ${error.message}
                    </td>
                </tr>`;
        }
    };

    // Cargar asistencias del día actual al iniciar la página
    fetchAttendances();

    // Buscar asistencias según la fecha seleccionada
    buscarFechaBtn.addEventListener("click", () => {
        const selectedDate = fechaFiltro.value;
        if (!selectedDate) {
            alert("Por favor, selecciona una fecha.");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        if (selectedDate > today) {
            alert("No puedes seleccionar una fecha futura.");
            return;
        }

        fetchAttendances(selectedDate);
    });

    // Sincronizar el estado del sidebar entre pestañas
    window.addEventListener("storage", (event) => {
        if (event.key === "sidebarContraido") {
            const sidebar = document.getElementById("sidebar");
            if (event.newValue === "true") {
                sidebar.classList.add("contraido");
            } else {
                sidebar.classList.remove("contraido");
            }
        }
    });

    // Inicializar el estado del sidebar al cargar la página
    const sidebar = document.getElementById("sidebar");
    const sidebarState = localStorage.getItem("sidebarContraido");
    if (sidebarState === "true") {
        sidebar.classList.add("contraido");
    }

    // Alternar el estado del sidebar y guardarlo en localStorage
    const toggleButton = document.getElementById("toggleSidebar");
    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("contraido");
            const isContraido = sidebar.classList.contains("contraido");
            localStorage.setItem("sidebarContraido", isContraido);
        });
    }
});