document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const membresiasContainer = document.getElementById("membresias-container");
    const pageInfo = document.getElementById("pageInfo");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");

    let currentPage = 1;
    const itemsPerPage = 20; // Mostrará 20 membresías por página

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
        window.location.href = "dashboard.html";
        return;
    }

    async function fetchMembresias(page) {
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=${page}&limit=${itemsPerPage}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            console.log("Membresías obtenidas:", data);

            // Limpiar el contenedor
            membresiasContainer.innerHTML = "";

            if (!data.membresias.length) {
                membresiasContainer.innerHTML = `<p class="text-center text-gray-400">No hay membresías activas.</p>`;
                return;
            }

            // Crear tarjetas dinámicamente
            data.membresias.forEach(membresia => {
                const card = document.createElement("div");
                card.className = "bg-gray-800 p-4 rounded-lg shadow-lg hover:scale-105 transition transform duration-300";

                card.innerHTML = `
                    <img src="${membresia.imagen}" alt="Foto de ${membresia.nombre_completo}" class="w-24 h-24 rounded-full object-cover mb-3">
                    <h2 class="text-lg font-bold text-purple-400">${membresia.nombre_completo}</h2>
                    <p class="text-sm text-gray-300"><strong>Email:</strong> ${membresia.email}</p>
                    <p class="text-sm text-gray-300"><strong>Plan:</strong> ${membresia.nombre_plan}</p>
                    <p class="text-sm text-gray-300"><strong>Inicio:</strong> ${new Date(membresia.fecha_inicio).toLocaleDateString()}</p>
                    <p class="text-sm text-gray-300"><strong>Fin:</strong> ${new Date(membresia.fecha_fin).toLocaleDateString()}</p>
                `;

                membresiasContainer.appendChild(card);
            });

            // Actualizar información de la página
            pageInfo.textContent = `Página ${currentPage} de ${data.totalPages}`;

            // Control de paginación
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage >= data.totalPages;

        } catch (error) {
            console.error("Error al obtener membresías:", error);
            membresiasContainer.innerHTML = `<p class="text-red-400 text-center">Error al cargar las membresías.</p>`;
        }
    }

    // Eventos de paginación
    prevPageBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            fetchMembresias(currentPage);
        }
    });

    nextPageBtn.addEventListener("click", () => {
        currentPage++;
        fetchMembresias(currentPage);
    });

    // Cargar la primera página
    fetchMembresias(currentPage);
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
