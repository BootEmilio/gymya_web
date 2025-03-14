document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymId = localStorage.getItem("selected_gym_id");
    const membresiasContainer = document.getElementById("membresias-container");
    const pageInfo = document.getElementById("pageInfo");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");

    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("contraido");
    });

    let currentPage = 1;
    const itemsPerPage = 20; // Mostrará 20 membresías por página

    if (!token || !gymId) {
        alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
        window.location.href = "dashboard.html";
        return;
    }

    // Función para cargar los planes disponibles
    async function cargarPlanes() {
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/planes`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            const data = await response.json();
            const planSelect = document.getElementById("plan_id");

            // Limpiar opciones anteriores
            planSelect.innerHTML = '<option value="">Seleccionar Plan</option>';

            // Agregar opciones de planes
            data.forEach(plan => {
                const option = document.createElement("option");
                option.value = plan._id;
                option.textContent = plan.nombre;
                planSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error al cargar los planes:", error);
            alert("Error al cargar los planes");
        }
    }

    // Mostrar el modal al hacer clic en "Agregar Membresía"
    document.getElementById('mostrarModalMembresia').addEventListener('click', async function() {
        // Cargar los planes antes de mostrar el modal
        await cargarPlanes();
        document.getElementById('modalAgregarMembresia').style.display = 'flex';
    });

    // Ocultar el modal al hacer clic en la "X"
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('modalAgregarMembresia').style.display = 'none';
    });

    // Ocultar el modal si se hace clic fuera del contenido
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('modalAgregarMembresia');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Función para cargar las membresías
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

    document.getElementById("agregar-membresia-form").addEventListener("submit", async (e) => {
        e.preventDefault();
    
        // Verificar que los elementos del formulario existan
        const nombre_completo = document.getElementById("nombre_completo");
        const email = document.getElementById("email");
        const plan_id = document.getElementById("plan_id");
    
        if (!nombre_completo || !email   || !plan_id) {
            console.error("Uno o más elementos del formulario no existen.");
            return;
        }
    
        // Obtener los valores de los campos
        const nombreCompletoValue = nombre_completo.value;
        const emailValue = email.value;
        const planIdValue = plan_id.value;
    
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/user/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    plan_id: planIdValue,
                    nombre_completo: nombreCompletoValue,
                    email: emailValue
                })
            });
    
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    
            const data = await response.json();
            alert("Membresía y usuario registrados exitosamente");
    
            // Limpiar el formulario
            document.getElementById("agregar-membresia-form").reset();
    
            // Ocultar el modal
            document.getElementById("modalAgregarMembresia").style.display = "none";
    
            // Recargar la lista de membresías
            fetchMembresias(currentPage); // Recargar la página actual
        } catch (error) {
            console.error("Error al agregar la membresía:", error);
            alert("Error al agregar la membresía");
        }
    });

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