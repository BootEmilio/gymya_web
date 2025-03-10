document.addEventListener("DOMContentLoaded", () => {
    // Obtener el ID del gimnasio desde localStorage
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    // Mostrar el nombre del gimnasio en el header
    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

    // Llamada a la API para obtener el número de membresías activas
    obtenerMembresiasActivas(gymId).then((totalActivas) => {
        // Actualizar el contenido en la tarjeta de "Membresías Activas"
        const membresiasActivasElement = document.querySelector('.Membresias_activas .text-2xl');
        if (membresiasActivasElement) {
            membresiasActivasElement.textContent = totalActivas;
        }
    });
});

// Función para obtener el número de membresías activas desde la API
async function obtenerMembresiasActivas(gymId) {
    try {
        // Realizar la llamada a la API
        const response = await fetch(`https://api-gymya-api.onrender.com/api/membresias?gymId=${gymId}&status=activas`);
        
        if (!response.ok) {
            throw new Error('No se pudieron obtener las membresías activas');
        }
        
        // Obtener los datos de la respuesta
        const data = await response.json();
        
        // Retornar el número total de membresías activas
        return data.total;
    } catch (error) {
        console.error('Error al obtener las membresías activas:', error);
        return 0;  // Retorna 0 si ocurre un error
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Resaltar la pestaña activa del menú
    const links = document.querySelectorAll("aside nav a");
    const currentPage = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo actual

    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("bg-purple-600", "text-white"); // Resaltar la pestaña activa
        }
    });
});
