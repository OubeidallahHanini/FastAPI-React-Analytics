import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import AuthNavbar from "../../components/Navbars/AuthNavbar"; // Assure-toi du bon chemin

export default function Register() {
  const history = useHistory();

  // États pour gérer les inputs et les erreurs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false); // Case à cocher
  const [errors, setErrors] = useState({ email: "", password: "", acceptTerms: "" });

  // Fonction de validation
  const validateForm = () => {
    let isValid = true;
    let newErrors = { email: "", password: "", acceptTerms: "" };

    // Vérification email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }

    // Vérification mot de passe
    if (!password) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    // Vérification case "Accepter les droits"
    if (!acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms and conditions.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour gérer l'inscription
  const handleSignUp = async () => {
    if (!validateForm()) {
      return; // Arrêter si le formulaire n'est pas valide
    }

    try {
      const response = await axios.post("http://localhost:9000/auth/register", {
        email,
        password,
      });

      console.log("Réponse de l'API :", response.data);
      alert("Account successfully created! Redirecting to login...");
      history.push("/auth/login"); // Rediriger vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de l'inscription :", error);
      alert("An error occurred. Please try again.");
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
                  <h6 className="text-blueGray-500 text-sm font-bold">Sign Up</h6>
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
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  {/* Case à cocher "Accepter les droits" */}
                  <div className="mb-4">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 w-5 h-5"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a href="#pablo" className="text-lightBlue-500" onClick={(e) => e.preventDefault()}>
                          Terms and Conditions
                        </a>
                      </span>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>

                  {/* Bouton d'inscription */}
                  <div className="text-center mt-6">
                    <button
                      onClick={handleSignUp}
                      className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg w-full"
                      type="button"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-wrap mt-6 relative">
              <div className="w-1/3 text-left">
                <a href="/auth/login" className="text-blueGray-200">
                  <small>Already have an account? Sign In</small>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
