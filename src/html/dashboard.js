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

        if (!gyms.length) {
            gymListContainer.innerHTML = "<p>No tienes gimnasios asignados.</p>";
            return;
        }

        gyms.forEach(gym => {
            const button = document.createElement("button");
            button.textContent = gym.nombre; // Suponiendo que hay un campo "nombre" en la respuesta
            button.addEventListener("click", () => {
                localStorage.setItem("selected_gym_id", gym.id); // Guarda el ID del gimnasio
                window.location.href = `membresias.html?gym_id=${gym.id}`;
            });
            gymListContainer.appendChild(button);
        });

    } catch (error) {
        console.error("Error al obtener los gimnasios:", error);
        gymListContainer.innerHTML = "<p>Error al cargar los gimnasios.</p>";
    }
});
