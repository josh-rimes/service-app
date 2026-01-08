import { createContext, useContext, useEffect, useState} from "react";
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
                setUser({
                    email: payload.sub,
                    role: payload.role,
                });
            }
        } catch (error) {
            logout();
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", response.data);

        const payload = JSON.parse(atob(response.data.split(".")[1]));
        setUser({ email: payload.sub, role: payload.role });

        return payload.role;
    };

    const logout = () => {
        localStorage.removeItem("token");
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