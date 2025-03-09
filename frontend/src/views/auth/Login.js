import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import AuthNavbar from "../../components/Navbars/AuthNavbar";  // Assure-toi de ce chemin exact

export default function Login() {
  const history = useHistory();
  
  // États pour gérer les inputs et les erreurs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Fonction de validation
  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    // Vérification de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // Vérification du mot de passe
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    // Met à jour les erreurs
    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour gérer la connexion
  const handleSignIn = async () => {
    if (!validateForm()) {
      return;  // Arrêter l'exécution si le formulaire n'est pas valide
    }

    try {
      const response = await axios.post(
        "http://localhost:9000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      Cookies.set("token", response.data.token);
      history.push("/admin/dashboard");
    } catch (error) {
      console.error("Erreur API :", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                <div className="text-center mb-3">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Sign in 
                  </h6>
                </div>
                <hr className="mt-6 border-b-1 border-blueGray-300" />
              </div>
              <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                <form onSubmit={(e) => e.preventDefault()}>
                  {/* Champ Email */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ${
                        errors.email ? "border border-red-500" : ""
                      }`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Champ Mot de passe */}
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full ${
                        errors.password ? "border border-red-500" : ""
                      }`}
                      placeholder="Password"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                  </div>

               

                  {/* Bouton de connexion */}
                  <div className="text-center mt-6">
                    <button
                      onClick={handleSignIn}
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                      type="button"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/3 text-left">
                <Link to="/auth/register" className="text-blueGray-200">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
