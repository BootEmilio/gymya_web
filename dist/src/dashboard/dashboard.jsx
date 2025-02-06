import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h2>Bienvenido al Dashboard</h2>
      <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
