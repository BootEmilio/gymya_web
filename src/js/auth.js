// Función para obtener el token del localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Función para guardar el token en localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    try {
        // Decodificar el token (si es JWT) para verificar expiración
        const payload = JSON.parse(atob(token.split('.')[1])); 
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now; // Retorna false si el token expiró
    } catch (error) {
        console.error('Error al verificar el token:', error);
        return false;
    }
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.replace('/login.html'); // Redirigir al login correctamente
}

// Flag para evitar múltiples redirecciones simultáneas
let isLoggingOut = false;

// Función para hacer solicitudes autenticadas a la API
async function fetchWithAuth(url, options = {}) {
    const token = getToken();

    if (!token) {
        if (!isLoggingOut) {
            isLoggingOut = true;
            alert('No estás autenticado. Redirigiendo al login...');
            logout();
        }
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Se añade por defecto si no está en options
        ...options.headers
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) { // Token inválido o expirado
            if (!isLoggingOut) {
                isLoggingOut = true;
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                logout();
            }
            return;
        }

        return response;
    } catch (error) {
        console.error('Error de conexión:', error);
        throw error;
    }
}

// Exportar funciones para que estén disponibles en otros archivos
export { getToken, setToken, isAuthenticated, logout, fetchWithAuth };
