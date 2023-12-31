import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/constants";
import { DefaultLayout } from "../../components/UI/DefaultLayout";
import { useState } from "react";
import { AuthResponseError } from "../../types/types";

export function SignupPage() {
	const [name, setName] = useState("");
	const [user, setUser] = useState("");
	const [password, setPassword] = useState("");
	const [responseError, setResponseError] = useState("");

	const goTo = useNavigate();

	const auth = useAuth();

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		try {
			const response = await fetch(`${API_URL}/signup`, {
				method: "POST",
				headers: {
					"Content-type": "application/json",
				},
				body: JSON.stringify({
					name,
					user,
					password,
				}),
			});
			if (response.ok) {
				setResponseError("");

				goTo("/");
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
				<h1>Registrase</h1>
				{responseError && <div className="errorMessage">{responseError}</div>}
				<label htmlFor="nombre">Nombre</label>
				<input
					type="text"
					id="nombre"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
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
				<button>Crear</button>
			</form>
		</DefaultLayout>
	);
}
