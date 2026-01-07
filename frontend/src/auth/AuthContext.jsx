import { createContext, useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

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
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);