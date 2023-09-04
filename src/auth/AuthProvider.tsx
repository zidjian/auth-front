import { createContext, useState, useContext, useEffect } from "react";
import { AuthResponse, User, accessTokenResponse } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthContext = createContext({
    isAuthenticated: false,
    getAccessToken: () => {},
    saveUser: (userData: AuthResponse) => {},
    getRefreshToken: () => {},
    getUserName: () => ({} as User | undefined),
});

export function AuthProvider({ children }: AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [user, setUser] = useState<User>();

    useEffect(() => {
        checkAuth();
    }, []);

    async function getUserInfo(token: string) {
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.body;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function checkAuth() {
        if (accessToken) {
            //  Usuario autenticado
        } else {
            // Usuario no autenticado
            const token = getRefreshToken();
            if (token) {
                const newAccessToken = await requestNewAccessToken(token);
                if (newAccessToken) {
                    const userInfo = await getUserInfo(newAccessToken);
                    if (userInfo) {
                        saveSesionInfo(userInfo, newAccessToken, token);
                    }
                }
            }
        }
    }

    function saveSesionInfo(
        userInfo: User,
        accessToken: string,
        refreshToken: string
    ) {
        setAccessToken(accessToken);
        setUser(userInfo);
        localStorage.setItem("token", JSON.stringify(refreshToken));
        setIsAuthenticated(true);
    }

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response = await fetch(`${API_URL}/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            });

            console.log(await response);

            if (response.ok) {
                const json = (await response.json()) as accessTokenResponse;
                if (json.error) {
                    throw new Error(json.error);
                }
                return json.body;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function getAccessToken() {
        return accessToken;
    }

    function getRefreshToken(): string | null {
        const tokenData = localStorage.getItem("token");

        if (tokenData) {
            const token  = JSON.parse(tokenData);

            return token;
        }
        return null;
    }

    function saveUser(userData: AuthResponse) {
        saveSesionInfo(
            userData.body.user,
            userData.body.accessToken,
            userData.body.refreshToken
        );
    }

    function getUserName(): string | undefined {
        return user?.name;
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                getAccessToken,
                saveUser,
                getRefreshToken,
                getUserName,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
