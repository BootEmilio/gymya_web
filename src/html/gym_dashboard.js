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

    // Configurar actualización manual con botón (opcional)
    const refreshBtn = document.getElementById("refresh-btn");
    if (refreshBtn) {
        refreshBtn.addEventListener("click", () => {
            actualizarEstadisticas(gymId, token);
        });
    }

    // Lógica para el sidebar contraíble
    const sidebar = document.getElementById("sidebar");
    const toggleButton = document.getElementById("toggleSidebar");

    // Verificar el estado guardado en localStorage
    const sidebarState = localStorage.getItem("sidebarContraido");
    if (sidebarState === "true") {
        sidebar.classList.add("contraido");
    }

    // Alternar el estado del sidebar y guardarlo en localStorage
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("contraido");
        localStorage.setItem("sidebarContraido", sidebar.classList.contains("contraido"));
    });
});

// Función para formatear la hora
function obtenerHoraActual() {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

// Función para actualizar todas las estadísticas
async function actualizarEstadisticas(gymId, token) {
    try {
        // Mostrar estado de carga
        document.getElementById("hora-actualizacion").textContent = "Actualizando...";
        
        // Obtener todos los datos en paralelo
        const [activas, total, asistencias, ingresos] = await Promise.all([
            obtenerMembresiasActivas(gymId, token),
            obtenerTotalMembresias(gymId, token),
            obtenerAsistenciasHoy(gymId, token)
        ]);

        // Actualizar la UI con animaciones
        actualizarTarjetaConAnimacion('.glass-card:nth-child(1) .text-2xl', activas);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(2) .text-2xl', total);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(3) .text-2xl', asistencias);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(4) .text-2xl', `$${ingresos}`);
        
        // Actualizar hora
        document.getElementById("hora-actualizacion").textContent = 
            `Última actualización: ${obtenerHoraActual()}`;
        
        // Actualizar gráfico
        const data = await obtenerDatosParaGrafico(gymId, token);
        if (data) renderizarGrafico(data);
        
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        document.getElementById("hora-actualizacion").textContent = 
            `Error en actualización: ${obtenerHoraActual()}`;
    }
}

// Función para animar la actualización de tarjetas
function actualizarTarjetaConAnimacion(selector, valor) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        elemento.classList.add('animate-pulse', 'text-purple-400');
        setTimeout(() => {
            elemento.textContent = valor;
            elemento.classList.remove('animate-pulse', 'text-purple-400');
        }, 300);
    }
}

// Función para obtener el número de membresías activas
async function obtenerMembresiasActivas(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/membresias/activas/count?gymId=${gymId}`, 
            token
        );
        return data?.total || 0;
    } catch (error) {
        console.error('Error al obtener membresías activas:', error);
        return 0;
    }
}

// Función para obtener el total de membresías
async function obtenerTotalMembresias(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/membresias/count?gymId=${gymId}`, 
            token
        );
        return data?.total || 0;
    } catch (error) {
        console.error('Error al obtener total de membresías:', error);
        return 0;
    }
}

// Función para obtener asistencias de hoy
async function obtenerAsistenciasHoy(gymId, token) {
    try {
        const response = await fetch(
            `https://api-gymya-api.onrender.com/api/asistencias/${gymId}/contarAsistencias`, 
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);
        
        const data = await response.json();
        return data.asistencias || 0;
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        return 0;
    }
}

// Función para obtener datos para el gráfico
async function obtenerDatosParaGrafico(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/membresias/grafico?gymId=${gymId}`, 
            token
        );
        return data;
    } catch (error) {
        console.error('Error al obtener datos para gráfico:', error);
        return null;
    }
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
        return null;
    }
}

// Función para renderizar el gráfico con Chart.js
function renderizarGrafico(data) {
    const canvas = document.getElementById('membresiasChart');
    
    // Destruir gráfico anterior si existe
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    const ctx = canvas.getContext('2d');
    canvas.chart = new Chart(ctx, {
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
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
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