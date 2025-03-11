document.addEventListener("DOMContentLoaded", () => {
    // Verificar si hay un gimnasio seleccionado
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    // Mostrar el ID del gimnasio
    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

    // Verificar si hay un token de autenticación
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No se encontró el token de autenticación.");
        window.location.href = "login.html";
        return;
    }

    // Obtener y mostrar las estadísticas
    actualizarEstadisticas(gymId, token);

    // Resaltar el enlace activo en el sidebar
    resaltarEnlaceActivo();

    // Configurar la actualización automática cada 5 minutos
    setInterval(() => {
        actualizarEstadisticas(gymId, token);
    }, 300000);  // 300000 ms = 5 minutos
});

// Función para actualizar todas las estadísticas
async function actualizarEstadisticas(gymId, token) {
    // Obtener y mostrar las membresías activas
    obtenerMembresiasActivas(gymId, token).then((totalActivas) => {
        const membresiasActivasElement = document.querySelector('.glass-card:nth-child(1) .text-2xl');
        if (membresiasActivasElement) {
            membresiasActivasElement.textContent = totalActivas;
        }
    });

    // Obtener y mostrar los usuarios registrados
    obtenerUsuariosRegistrados(gymId, token).then((totalUsuarios) => {
        const usuariosRegistradosElement = document.querySelector('.glass-card:nth-child(2) .text-2xl');
        if (usuariosRegistradosElement) {
            usuariosRegistradosElement.textContent = totalUsuarios;
        }
    });

    // Obtener y mostrar los ingresos mensuales
    obtenerIngresosMensuales(gymId, token).then((totalIngresos) => {
        const ingresosMensualesElement = document.querySelector('.glass-card:nth-child(3) .text-2xl');
        if (ingresosMensualesElement) {
            ingresosMensualesElement.textContent = `$${totalIngresos}`;
        }
    });

    // Obtener datos para el gráfico de membresías activas
    obtenerDatosParaGrafico(gymId, token).then((data) => {
        if (data) {
            renderizarGrafico(data);
        }
    });
}

// Función para obtener el número de membresías activas
async function obtenerMembresiasActivas(gymId, token) {
    const data = await obtenerDatos(`https://api-gymya-api.onrender.com/api/membresias/count?gymId=${gymId}&status=activas`, token);
    return data ? data.total : 0;
}

// Función para obtener el número de usuarios registrados
async function obtenerUsuariosRegistrados(gymId, token) {
    const data = await obtenerDatos(`https://api-gymya-api.onrender.com/api/membresias/total?gymId=${gymId}`, token);
    return data ? data.total : 0;
}

// Función para obtener los ingresos mensuales
async function obtenerIngresosMensuales(gymId, token) {
    const data = await obtenerDatos(`https://api-gymya-api.onrender.com/api/ingresos?gymId=${gymId}`, token);
    return data ? data.total : 0;
}

// Función para obtener datos para el gráfico
async function obtenerDatosParaGrafico(gymId, token) {
    const data = await obtenerDatos(`https://api-gymya-api.onrender.com/api/membresias/grafico?gymId=${gymId}`, token);
    return data;
}

// Función genérica para obtener datos de la API
async function obtenerDatos(url, token) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

// Función para renderizar el gráfico con Chart.js
function renderizarGrafico(data) {
    const ctx = document.getElementById('membresiasChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.meses,
            datasets: [{
                label: 'Membresías Activas',
                data: data.valores,
                backgroundColor: 'rgba(147, 51, 234, 0.6)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Función para resaltar el enlace activo en el sidebar
function resaltarEnlaceActivo() {
    const links = document.querySelectorAll("aside nav a");
    const currentPage = window.location.pathname.split("/").pop();
    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("bg-purple-600", "text-white");
        }
    });
}