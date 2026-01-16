import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));

            if (payload.exp * 1000 < Date.now()) {
                logout();
            } else {
                const userData = {
                    id: payload.id,
                    email: payload.sub,
                    role: payload.role,
                };

                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
            }
        } catch (error) {
            console.log("Failed to log in", error);
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        const token = response.data;

        localStorage.setItem("token", token);

        const payload = JSON.parse(atob(token.split(".")[1]));

        const userData = {
            id: payload.id,
            email: payload.sub,
            role: payload.role,
        };

        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        return payload.role;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
