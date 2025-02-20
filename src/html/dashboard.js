document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión para acceder.");
        window.location.href = "login.html";
    }
});

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
