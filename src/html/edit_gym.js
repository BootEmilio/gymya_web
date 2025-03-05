const token = localStorage.getItem("token");
const gymId = new URLSearchParams(window.location.search).get("gymId");

if (!token || !gymId) {
    alert("No tienes acceso. Inicia sesión o selecciona un gimnasio.");
    window.location.href = "dashboard.html";
}

// Función para cargar los datos del gimnasio
async function cargarGimnasio() {
    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/gym/${gymId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        document.getElementById("nombre").value = data.nombre;
        document.getElementById("direccion").value = data.direccion;
        document.getElementById("telefono").value = data.telefono;
        document.getElementById("horario").value = data.horario;

        // Mostrar la imagen actual si existe
        if (data.imagen) {
            const imagePreview = document.getElementById("image-preview");
            const currentImage = document.getElementById("current-image");

            imagePreview.classList.remove("hidden");
            currentImage.src = data.imagen;
        }
    } catch (error) {
        console.error("Error al cargar el gimnasio:", error);
        alert("Error al cargar el gimnasio");
    }
}

// Configuración del widget de Cloudinary
const cloudinaryWidget = cloudinary.createUploadWidget(
    {
        cloudName: "TU_CLOUD_NAME", // Reemplaza con tu Cloud Name de Cloudinary
        uploadPreset: "TU_UPLOAD_PRESET", // Reemplaza con tu Upload Preset
        sources: ["local", "url"], // Fuentes de imágenes permitidas
        multiple: false, // Permitir solo una imagen
        cropping: true, // Habilitar recorte de imágenes
        showAdvancedOptions: true, // Mostrar opciones avanzadas
    },
    (error, result) => {
        if (!error && result && result.event === "success") {
            // Mostrar la imagen subida
            const imagePreview = document.getElementById("image-preview");
            const currentImage = document.getElementById("current-image");

            imagePreview.classList.remove("hidden");
            currentImage.src = result.info.secure_url;

            // Guardar la URL de la imagen en un campo oculto
            document.getElementById("imagen-url").value = result.info.secure_url;
        }
    }
);

// Abrir el widget de Cloudinary al hacer clic en el botón
document.getElementById("upload-image").addEventListener("click", () => {
    cloudinaryWidget.open();
});

// Función para guardar los cambios
document.getElementById("editar-gimnasio-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const horario = document.getElementById("horario").value;
    const imagen = document.getElementById("imagen-url").value;

    try {
        const response = await fetch(`https://api-gymya-api.onrender.com/api/${gymId}/editar`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre,
                direccion,
                telefono,
                horario,
                imagen
            })
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        alert("Gimnasio actualizado exitosamente");
        window.location.href = "dashboard.html"; // Redirigir al dashboard
    } catch (error) {
        console.error("Error al actualizar el gimnasio:", error);
        alert("Error al actualizar el gimnasio");
    }
});

// Cargar los datos del gimnasio al iniciar la página
cargarGimnasio();