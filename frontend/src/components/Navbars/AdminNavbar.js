import React from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const history = useHistory();

const handleLogout = async () => {
  try {
    await axios.post("http://localhost:9000/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("token");

    history.push("/login"); // Utiliser history.push() en v5
  } catch (error) {
    console.error("Erreur lors de la déconnexion :", error);
  }
};

  return (
    <>
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full z-10 bg-transparent md:flex-row md:flex-nowrap md:justify-start flex items-center p-4">
        <div className="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap md:px-10 px-4">
          {/* Brand */}
          <a
            className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            Welcome to our internal dashboard
          </a>

          {/* User */}
          <ul className="flex-col md:flex-row list-none items-center hidden md:flex">
            <button
              onClick={handleLogout} // Ajout de la fonction de déconnexion
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-105 active:scale-95"
            >
              Logout
            </button>
          </ul>
        </div>
      </nav>
      {/* End Navbar */}
    </>
  );
}
