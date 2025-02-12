// Función para obtener el token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = getToken();
    return !!token; // Devuelve true si el token existe, false si no
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/login'; // Redirigir al login
}

// Función para hacer solicitudes autenticadas a la API
async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!token) {
        alert('No estás autenticado. Redirigiendo al login...');
        window.location.href = '/login';
        return;
    }

    // Agregar el token al encabezado de la solicitud
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
            alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
            logout();
            return;
        }

        return response;
    } catch (error) {
        console.error('Error de conexión:', error);
        throw error;
    }
}

// Exportar funciones para que estén disponibles en otros archivos
export { getToken, isAuthenticated, logout, fetchWithAuth };