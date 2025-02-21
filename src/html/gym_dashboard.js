document.addEventListener("DOMContentLoaded", () => {
    const gymId = localStorage.getItem("selected_gym_id");
    if (!gymId) {
        alert("No se encontró el gimnasio seleccionado.");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("gym-name").textContent = `Gimnasio ID: ${gymId}`;

});
