document.addEventListener("DOMContentLoaded", async () => {
    const gymId = localStorage.getItem("selected_gym_id");
    const token = localStorage.getItem("token");
    const membresiasContainer = document.getElementById("membresias-list");

    if (!gymId || !token) {
        alert("No tienes acceso. Inicia sesión.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/membresias/activas?page=1&limit=10`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        membresiasContainer.innerHTML = JSON.stringify(data, null, 2);
    } catch (error) {
        console.error("Error al obtener membresías:", error);
        membresiasContainer.innerHTML = "<p>Error al cargar las membresías</p>";
    }
});
