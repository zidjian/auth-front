import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoginPage } from "./pages/Login/index.tsx";
import { SignupPage } from "./pages/Signup/index.tsx";
import { DashboardPage } from "./pages/Dashboard/index.tsx";
import { ProtectedRoute } from "./pages/ProtectedRoute/index";
import { AuthProvider } from "./auth/AuthProvider.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LoginPage />,
	},
	{
		path: "/sign-up",
		element: <SignupPage />,
	},
	{
		path: "/",
		element: <ProtectedRoute />,
		children: [
			{
				path: "dashboard",
				element: <DashboardPage />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>
);
