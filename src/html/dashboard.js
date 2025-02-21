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
            card.className = "bg-gray-900 rounded-lg overflow-hidden shadow-lg hover-scale neon-border w-80";
            card.innerHTML = `
                <img src="/recursos/img/sucursal.png" alt="${gym.nombre}" class="w-full h-48 object-cover">
                <div class="p-4">
                    <h3 class="text-xl font-bold text-purple-500">${gym.nombre}</h3>
                    <p class="text-gray-400 mt-2">${gym.direccion || "Dirección no disponible"}</p>
                </div>
            `;
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