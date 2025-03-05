document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const gymListContainer = document.getElementById("gym-list");

    if (!token) {
        alert("No tienes acceso. Inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch("https://api-gymya-api.onrender.com/api/gym", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const gyms = await response.json();
        console.log("Gimnasios obtenidos:", gyms);

        if (!gyms.length) {
            gymListContainer.innerHTML = "<p class='text-gray-400'>No tienes gimnasios asignados.</p>";
            return;
        }

        gyms.forEach(gym => {
            const card = document.createElement("div");
            card.className = "bg-gray-900 rounded-lg overflow-hidden shadow-lg hover-scale neon-border w-80 relative";
            
            // Usa la URL de la imagen del gimnasio o una imagen por defecto
            const imageUrl = gym.imagen ? gym.imagen : "/recursos/img/sucursal.png";

            card.innerHTML = `
                <img src="${imageUrl}" alt="${gym.nombre}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-bold text-purple-500">${gym.nombre}</h3>
                    <p class="text-gray-400 mt-2">${gym.direccion || "Dirección no disponible"}</p>
                </div>
                <!-- Botón de edición -->
                <button onclick="editarGimnasio('${gym._id}')" class="absolute top-2 right-2 text-purple-500 hover:text-purple-700 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                </button>
            `;

            // Redirigir al dashboard del gimnasio al hacer clic en la tarjeta
            card.addEventListener("click", () => {
                console.log("Gimnasio seleccionado:", gym._id);
                localStorage.setItem("selected_gym_id", gym._id);                
                console.log("selected_gym_id guardado:", localStorage.getItem("selected_gym_id"));
                window.location.href = `gym_dashboard.html`;
            });

            gymListContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error al obtener los gimnasios:", error);
        gymListContainer.innerHTML = "<p class='text-red-400'>Error al cargar los gimnasios.</p>";
    }
});

// Función para editar un gimnasio
window.editarGimnasio = (gymId) => {
    // Evita que el evento de clic en la tarjeta se dispare al hacer clic en el botón de edición
    event.stopPropagation();
    window.location.href = `edit_gym.html?gymId=${gymId}`;
};