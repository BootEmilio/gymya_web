const token = localStorage.getItem("token");
const gymId = localStorage.getItem("selected_gym_id");

if (!token || !gymId) {
    alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
    window.location.href = "dashboard.html";
}

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

// Inicializar el estado del sidebar al cargar la página
const sidebar = document.getElementById("sidebar");
const sidebarState = localStorage.getItem("sidebarContraido");
if (sidebarState === "true") {
    sidebar.classList.add("contraido");
}

// Alternar el estado del sidebar y guardarlo en localStorage
const toggleButton = document.getElementById("toggleSidebar");
if (toggleButton) {
    toggleButton.addEventListener("click", () => {
        sidebar.classList.toggle("contraido");
        const isContraido = sidebar.classList.contains("contraido");
        localStorage.setItem("sidebarContraido", isContraido);
    });
}

// Mostrar/ocultar el formulario de agregar plan
document.getElementById('mostrarFormulario').addEventListener('click', function() {
    const formulario = document.getElementById('formularioAgregarPlan');
    formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
});

// Función para cargar los planes
async function cargarPlanes() {
    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/planes`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        const planesList = document.getElementById("planes-list");
        planesList.innerHTML = "";

        data.forEach(plan => {
            const planItem = document.createElement("div");
            planItem.className = "bg-gray-800 p-6 rounded-lg neon-border hover-scale";
            planItem.innerHTML = `
                <h3 class="text-xl font-semibold text-purple-400">${plan.nombre}</h3>
                <p class="text-purple-300 mt-2">${plan.descripcion}</p>
                <p class="text-purple-300">Costo: $${plan.costo}</p>
                <p class="text-purple-300">Duración: ${plan.duracion_meses} meses, ${plan.duracion_semanas} semanas, ${plan.duracion_dias} días</p>
                <div class="mt-4 space-x-4">
                    <button onclick="editarPlan('${plan._id}')" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200">Editar</button>
                    <button onclick="eliminarPlan('${plan._id}')" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200">Eliminar</button>
                </div>
            `;
            planesList.appendChild(planItem);
        });
    } catch (error) {
        console.error("Error al cargar los planes:", error);
        alert("Error al cargar los planes");
    }
}

// Función para editar un plan
function editarPlan(planId) {
    window.location.href = `editar_plan.html?planId=${planId}`;
}

// Función para eliminar un plan
async function eliminarPlan(planId) {
    if (confirm("¿Estás seguro de que deseas eliminar este plan?")) {
        try {
            const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/planes/${planId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

            alert("Plan eliminado exitosamente");
            cargarPlanes(); // Recargar la lista de planes
        } catch (error) {
            console.error("Error al eliminar el plan:", error);
            alert("Error al eliminar el plan");
        }
    }
}

// Función para agregar un plan
document.getElementById("agregar-plan-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const costo = document.getElementById("costo").value;
    const duracion_meses = document.getElementById("duracion_meses").value;
    const duracion_semanas = document.getElementById("duracion_semanas").value;
    const duracion_dias = document.getElementById("duracion_dias").value;

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/planes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre,
                descripcion,
                costo,
                duracion_meses,
                duracion_semanas,
                duracion_dias,
                gymIds: [gymId]
            })
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        alert("Plan creado exitosamente");

        // Limpiar el formulario
        document.getElementById("agregar-plan-form").reset();

        // Ocultar el formulario
        document.getElementById("formularioAgregarPlan").style.display = "none";

        // Recargar la lista de planes
        cargarPlanes();
    } catch (error) {
        console.error("Error al crear el plan:", error);
        alert("Error al crear el plan");
    }
});

// Cargar planes al iniciar la página
cargarPlanes();