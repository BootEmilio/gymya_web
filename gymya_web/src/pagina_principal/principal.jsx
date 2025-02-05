import { useState } from "react";
import { Menu, X } from "lucide-react";

function HeroSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full  shadow-md p-4 flex items-center justify-between z-50">
        {/* Botón hamburguesa */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Logo */}
        <h1 className="text-2xl font-bold text-white">GymYa</h1>

        {/* Botones en pantallas grandes */}
          <div className="hidden md:flex space-x-6">
          <a href="#" className="text-white hover:text-purple-600">Conócenos</a>
          <a href="#" className="text-white hover:text-purple-600">Planes</a>
          <a href="#" className="text-white hover:text-purple-600">¿Qué es GymYa?</a>
          </div>

        {/* Botón de iniciar sesión */}
        <button className="hidden md:block bg-red-900 text-white px-4 py-2 rounded-full font-semibold hover:bg-purple-800 transition">
          Iniciar sesión
        </button>
      </nav>

      {/* Menú móvil */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md p-4 flex flex-col space-y-4 z-40">
          <a href="#" className="text-gray-700 hover:text-black">Conócenos</a>
          <a href="#" className="text-gray-700 hover:text-black">Planes</a>
          <a href="#" className="text-gray-700 hover:text-black">¿Qué es GymYa?</a>
          <a href="#" className="text-gray-700 hover:text-black">Información</a>
          <button className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-yellow-600 transition">
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Sección del Hero con video de fondo */}
      <div className="relative w-full min-h-screen flex items-center justify-center text-white">
        <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
          <source src="/src/recursos/4367514-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Tu navegador no soporta videos.
        </video>

        {/* Capa oscura para mejorar contraste */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

        {/* Contenido */}
        <div className="relative text-center max-w-3xl z-10">
          <h1 className="text-6xl font-bold text-purple-700">GymYa</h1>
          <p className="text-xl mt-4">Comunica, entrena y soluciona</p>
          <div className="mt-6 space-x-4">
            <button className="bg-purple-800 text-with px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
              Registrate
            </button>
            <button className="bg-purple-800 text-with px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition">
              Administra
            </button>
          </div>
        </div>
      </div>

      {/* Contenido de los planes que tendrá GymYa */}
     
<div className="flex flex-wrap mt-8 justify-center gap-20">
  {/* Primer plan */}
  <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
    <img
      className="w-full h-48 object-cover"
      src="/src/recursos/1.jpg"
      alt="Gym"
    />
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900">Plan basico</h2>
      <p className="text-gray-700">Descripción del plan.</p>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Ver más
      </button>
    </div>
  </div>

  {/* Segundo plan */}
  <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
    <img
      className="w-full h-48 object-cover"
      src="/src/recursos/1.jpg"
      alt="Gym"
    />
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900">Plan estandar</h2>
      <p className="text-gray-700">Descripción corta sobre la imagen.</p>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Ver más
      </button>
    </div>
  </div>

  {/* Tercer plan */}
  <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white">
    <img
      className="w-full h-48 object-cover"
      src="/src/recursos/1.jpg"
      alt="Gym"
    />
    <div className="p-4">
      <h2 className="text-xl font-bold text-gray-900">Plan avanzado</h2>
      <p className="text-gray-700">Descripción corta sobre la imagen.</p>
      <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
        Ver más
      </button>
         </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
