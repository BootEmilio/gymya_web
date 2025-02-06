import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(1); // Tarjeta activa inicial

  // 🔹 Lista de planes con imágenes distintas
  const plans = [
    { title: "Plan Básico", img: "/src/recursos/plan_basico.jpg" },
    { title: "Plan Estándar", img: "/src/recursos/plan_estandar.jpg" },
    { title: "Plan Avanzado", img: "/src/recursos/plan_avanzado.jpg" },
  ];

  // 🔹 Función para redirigir a la página de login
  const loginpage = () => {
    navigate('/login');
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* 🔹 Navbar */}
      <nav className="absolute top-0 left-0 w-full shadow-md p-4 flex items-center justify-between z-50">
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        <h1 className="text-2xl font-bold text-white">GymYa</h1>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-white hover:text-purple-600">Conócenos</a>
          <a href="#" className="text-white hover:text-purple-600">Planes</a>
          <a href="#" className="text-white hover:text-purple-600">¿Qué es GymYa?</a>
        </div>
        <button onClick={loginpage} className="hidden md:block bg-red-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-800 transition">
          Iniciar sesión
        </button>
      </nav>

      {/* 🔹 Sección Hero con video de fondo */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-white">
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/src/recursos/4367514-hd_1920_1080_30fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div className="relative text-center max-w-3xl z-10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: "easeOut" }}>
          <motion.h1 className="text-6xl font-bold text-purple-700" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            GymYa
          </motion.h1>
          <motion.p className="text-xl mt-4" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}>
            Comunica, entrena y soluciona
          </motion.p>
        </motion.div>
      </div>

      {/* 🔹 Nueva Sección con Imagen de Fondo */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center text-white">
        {/* 🔹 Imagen de fondo ocupando toda la nueva sección */}
        <div className="absolute inset-0 w-full h-full">
  <img className="w-full h-full object-contain object-right opacity-30" src="/src/recursos/2.jpg" alt="Fondo Sección Planes" />
</div>



        {/* 🔹 Texto sobre la imagen de fondo */}
        <div className="relative text-center max-w-3xl z-10 mt-10">
          <h2 className="text-5xl font-bold">
            <span className="text-white">Elige el mejor plan y</span> 
            <span className="text-purple-700"> administra</span>
          </h2>
        </div>

       {/* 🔹 Cards con efecto rotativo */}
<motion.div className="relative flex gap-8 justify-center mt-10 z-10" 
  initial={{ opacity: 0, y: 50 }} 
  whileInView={{ opacity: 1, y: 0 }} 
  transition={{ duration: 1 }}
>
  {plans.map((plan, index) => (
    <motion.div
      key={index}
      className="relative w-80 h-96 rounded-xl overflow-hidden shadow-lg cursor-pointer"
      onClick={() => setActiveIndex(index)} // Cambia la card activa
      initial={{ scale: 0.9, opacity: 0.6, rotateY: 0 }}
      animate={{
        scale: activeIndex === index ? 1.1 : 0.85,
        opacity: activeIndex === index ? 1 : 0.5,
        rotateY: activeIndex === index ? 0 : -15,
        zIndex: activeIndex === index ? 10 : 5,
      }}
      transition={{ duration: 0.6 }}
    >
      {/* 🔹 Imagen diferente en cada tarjeta */}
      <img className="absolute top-0 left-0 w-full h-full object-cover" src={plan.img} alt={plan.title} />
      <div className="absolute inset-0 bg-black opacity-40"></div>
      {/* 🔹 Contenido de la tarjeta */}
      <div className="absolute bottom-4 left-0 w-full text-center text-white p-4">
        <h2 className="text-2xl font-bold">{plan.title}</h2>
        <button className="mt-2 w-3/4 bg-purple-600 text-white py-2 rounded-full hover:bg-purple-700 transition">
          Más info
        </button>
      </div>
    </motion.div>
  ))}
</motion.div>

      </div>
    </div>
  );
}

export default HeroSection;
