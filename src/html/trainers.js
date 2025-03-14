document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const entrenadoresContainer = document.getElementById("entrenadores-container");
    const pageInfo = document.getElementById("pageInfo");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");

    let currentPage = 1;
    const itemsPerPage = 20; // Mostrará 20 entrenadores por página

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
        window.location.href = "dashboard.html";
        return;
    }

    // Función para cargar los entrenadores
    async function fetchEntrenadores(page) {
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/entrenadores?page=${page}&limit=${itemsPerPage}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            console.log("Entrenadores obtenidos:", data);

            // Limpiar el contenedor
            entrenadoresContainer.innerHTML = "";

            if (!data.length) {
                entrenadoresContainer.innerHTML = `<p class="text-center text-gray-400">No hay entrenadores registrados.</p>`;
                return;
            }

            // Crear tarjetas dinámicamente
            data.forEach(entrenador => {
                const card = document.createElement("div");
                card.className = "bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition transform duration-300";

                card.innerHTML = `
                    <img src="${entrenador.imagen}" alt="Foto de ${entrenador.nombre_completo}" class="w-24 h-24 rounded-full object-cover mb-3">
                    <h2 class="text-lg font-bold text-purple-400">${entrenador.nombre_completo}</h2>
                    <p class="text-sm text-gray-300"><strong>Especialidad:</strong> ${entrenador.especialidad}</p>
                    <p class="text-sm text-gray-300"><strong>Horario:</strong> ${entrenador.horario}</p>
                    <p class="text-sm text-gray-300"><strong>Independiente:</strong> ${entrenador.independiente ? "Sí" : "No"}</p>
                `;

                entrenadoresContainer.appendChild(card);
            });

            // Actualizar información de la página
            pageInfo.textContent = `Página ${currentPage}`;

            // Control de paginación (si es necesario)
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = data.length < itemsPerPage; // Deshabilitar si no hay más resultados

        } catch (error) {
            console.error("Error al obtener entrenadores:", error);
            entrenadoresContainer.innerHTML = `<p class="text-red-400 text-center">Error al cargar los entrenadores.</p>`;
        }
    }

    // Eventos de paginación
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchEntrenadores(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        fetchEntrenadores(currentPage);
    });

    // Cargar la primera página
    fetchEntrenadores(currentPage);

    // Mostrar el modal al hacer clic en "Agregar Entrenador"
    document.getElementById('mostrarModalEntrenador').addEventListener('click', function() {
        document.getElementById('modalAgregarEntrenador').style.display = 'flex';
    });

    // Ocultar el modal al hacer clic en la "X"
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('modalAgregarEntrenador').style.display = 'none';
    });

    // Ocultar el modal si se hace clic fuera del contenido
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modalAgregarEntrenador');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
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
});

// Resaltar pestaña activa en la barra lateral
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("aside nav a");
    const currentPage = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo actual

    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("bg-purple-600", "text-white"); // Resaltar la pestaña activa
        }
    });
});