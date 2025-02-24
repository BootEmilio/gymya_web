document.addEventListener("DOMContentLoaded", () => {
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

});


document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("aside nav a");
    const currentPage = window.location.pathname.split("/").pop(); // Obtiene el nombre del archivo actual

    links.forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("bg-purple-600", "text-white"); // Resaltar la pestaña activa
        }
    });
});
