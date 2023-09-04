import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { DefaultLayout } from "./../../components/UI/DefaultLayout";
import { useState } from "react";
import { API_URL } from "../../auth/constants";
import { AuthResponse, AuthResponseError } from "../../types/types";

export function LoginPage() {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [responseError, setResponseError] = useState("");

    const goTo = useNavigate();

    const auth = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    user,
                    password,
                }),
            });
            if (response.ok) {
                console.log("Login Exitoso");

                const json = (await response.json()) as AuthResponse;
                if (json.body.accessToken && json.body.refreshToken) {
                    setResponseError("");
                    auth.saveUser(json);
                    console.log(json.body.accessToken)
                    console.log(json.body.refreshToken)

                    goTo("/dashboard");
                }
            } else {
                console.log("Algo fue mal");
                const json = (await response.json()) as AuthResponseError;
                setResponseError(json.body.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <DefaultLayout>
            <form className="form" onSubmit={handleSubmit}>
                <h1>Login</h1>
                {responseError && (
                    <div className="errorMessage">{responseError}</div>
                )}
                <label htmlFor="usuario">Usuario</label>
                <input
                    type="text"
                    id="usuario"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                />
                <label htmlFor="contrasenia">Contraseña</label>
                <input
                    type="text"
                    id="contrasenia"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button>Ingresar</button>
            </form>
        </DefaultLayout>
    );
}
