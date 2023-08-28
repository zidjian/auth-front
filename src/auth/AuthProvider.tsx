import { createContext, useState, useContext, useEffect } from "react";
import { AuthResponse } from "../types/types";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: (userData: AuthResponse) => {},
    getRefreshToken: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");

    useEffect(() => {}, []);

    

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken() {
        const token = localStorage.getItem("token");

        if (token) {
            const { refreshToken } = JSON.parse(token);

            return refreshToken;
        }
    }

    function saveUser(userData: AuthResponse) {
        setAccessToken(userData.body.accessToken);

        localStorage.setItem(
            "token",
            JSON.stringify(userData.body.refreshToken)
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getAccessToken,
                saveUser,
                getRefreshToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
