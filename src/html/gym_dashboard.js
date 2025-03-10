document.addEventListener("DOMContentLoaded", () => {
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

    // Obtener el token de localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No se encontró el token de autenticación.");
        window.location.href = "login.html";
        return;
    }

    // Llamada a la API para obtener el número de membresías activas
    obtenerMembresiasActivas(gymId, token).then((totalActivas) => {
        const membresiasActivasElement = document.querySelector('.glass-card .text-2xl');
        if (membresiasActivasElement) {
            membresiasActivasElement.textContent = totalActivas;
        }
    });
});

// Función para obtener el número de membresías activas desde la API
async function obtenerMembresiasActivas(gymId, token) {
    try {
        // Realizar la llamada a la API con el token en los encabezados
        const response = await fetch(`https://api-gymya-api.onrender.com/api/membresias?gymId=${gymId}&status=activas`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`, // Agregar el token en el encabezado
            }
        });

        if (!response.ok) {
            throw new Error('No se pudieron obtener las membresías activas');
        }

        const data = await response.json();
        return data.total;  // Retornar el número total de membresías activas
    } catch (error) {
        console.error('Error al obtener las membresías activas:', error);
        return 0;  // Retorna 0 si ocurre un error
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("aside nav a");
    const currentPage = window.location.pathname.split("/").pop();

    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("bg-purple-600", "text-white");
        }
    });
});
