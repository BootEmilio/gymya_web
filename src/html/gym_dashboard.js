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

// Función para actualizar todas las estadísticas
async function actualizarEstadisticas(gymId, token) {
    try {
        // Mostrar estado de carga
        document.getElementById("hora-actualizacion").textContent = "Actualizando...";
        document.getElementById("hora-actualizacion-grafico").textContent = "Actualizando gráfico...";

        // Obtener todos los datos en paralelo
        const [activas, total, asistencias, ingresos, datosPlanes] = await Promise.all([
            obtenerMembresiasActivas(gymId, token),
            obtenerTotalMembresias(gymId, token),
            obtenerAsistenciasHoy(gymId, token),
            obtenerDatosPlanes(gymId, token)
        ]);

        // Actualizar la UI
        actualizarTarjetaConAnimacion('.glass-card:nth-child(1) .text-2xl', activas);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(2) .text-2xl', total);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(3) .text-2xl', asistencias);
        actualizarTarjetaConAnimacion('.glass-card:nth-child(4) .text-2xl', `$${ingresos}`);
        
        // Renderizar gráfico si hay datos
        if (datosPlanes) {
            renderizarGraficoPlanes(datosPlanes);
        }

        // Actualizar hora de última actualización
        const horaActual = new Date().toLocaleTimeString();
        document.getElementById("hora-actualizacion").textContent = `Última actualización: ${horaActual}`;
        
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
        mostrarError('Error al cargar datos. Intente recargar la página.');
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

// Función para mostrar errores
function mostrarError(mensaje) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.classList.remove('hidden');
        setTimeout(() => {
            errorElement.classList.add('hidden');
        }, 5000);
    }
}

// Función para obtener el número de membresías activas
async function obtenerMembresiasActivas(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/membresias/contarActivas/${gymId}`, 
            token
        );
        return data?.count || 0;
    } catch (error) {
        console.error('Error al obtener membresías activas:', error);
        return 0;
    }
}

// Función para obtener el total de membresías
async function obtenerTotalMembresias(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/membresias/contarTotal/${gymId}`, 
            token
        );
        return data?.count || 0;
    } catch (error) {
        console.error('Error al obtener total de membresías:', error);
        return 0;
    }
}

// Función para obtener asistencias de hoy
async function obtenerAsistenciasHoy(gymId, token) {
    try {
        const data = await obtenerDatos(
            `https://api-gymya-api.onrender.com/api/asistencias/contarHoy/${gymId}`, 
            token
        );
        return data?.count || 0;
    } catch (error) {
        console.error('Error al obtener asistencias:', error);
        return 0;
    }
}

// Función para obtener datos de distribución de planes
async function obtenerDatosPlanes(gymId, token) {
    try {
        const response = await fetch(
            `https://api-gymya-api.onrender.com/api/membresias/distribucionPlanes/${gymId}`, 
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener datos de planes:', error);
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
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        throw error;
    }
}

// Función para renderizar el gráfico de distribución de planes
function renderizarGraficoPlanes(data) {
    const canvas = document.getElementById('planesChart');
    
    // Destruir gráfico anterior si existe
    if (window.planesChart) {
        window.planesChart.destroy();
    }
    
    // Colores para los segmentos del gráfico
    const colores = [
        'rgba(99, 102, 241, 0.7)',  // Índigo
        'rgba(167, 139, 250, 0.7)', // Violeta claro
        'rgba(16, 185, 129, 0.7)',  // Verde
        'rgba(245, 158, 11, 0.7)',  // Amarillo
        'rgba(244, 63, 94, 0.7)',    // Rojo
        'rgba(14, 165, 233, 0.7)',   // Azul cielo
        'rgba(139, 92, 246, 0.7)'    // Violeta
    ];

    window.planesChart = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: data.planes.map(plan => plan.nombre),
            datasets: [{
                data: data.planes.map(plan => plan.cantidad),
                backgroundColor: colores,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 1,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#E5E7EB',
                        font: {
                            size: 12
                        },
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            },
            cutout: '65%',
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
    
    // Actualizar hora de actualización del gráfico
    document.getElementById("hora-actualizacion-grafico").textContent = 
        `Última actualización: ${new Date().toLocaleTimeString()}`;
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