// Función para obtener el token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    return !!getToken(); // Retorna true si hay token, false si no
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/login.html'; // Redirigir al login
}

// Función para proteger las páginas restringidas
function protectPage() {
    if (!isAuthenticated()) {
        alert('No tienes acceso. Inicia sesión primero.');
        window.location.href = '/login.html'; // Redirigir si no está autenticado
    }
}

// Función para hacer solicitudes autenticadas a la API
async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!token) {
        alert('No estás autenticado. Redirigiendo al login...');
        logout();
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) { // Token inválido o expirado
            alert('Tu sesión ha expirado. Inicia sesión nuevamente.');
            logout();
            return;
        }

        return response;
    } catch (error) {
        console.error('Error de conexión:', error);
        throw error;
    }
}

// Llamar `protectPage()` en todas las páginas protegidas
document.addEventListener('DOMContentLoaded', protectPage);

// Exportar funciones para usarlas en otros archivos si es necesario
export { getToken, isAuthenticated, logout, fetchWithAuth };
