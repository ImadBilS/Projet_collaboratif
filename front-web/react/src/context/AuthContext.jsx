import PropTypes from "prop-types";
import { loginApi, logout as logoutApi } from "../api/auth";
import { createContext, useContext, useState, useMemo } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;

        const decoded = jwtDecode(token);

        return {
            logged: true,
            user_id: decoded.user_id,
            firstname: decoded.firstname,
            lastname: decoded.lastname,
            role: decoded.role
        };
    });


    // Correction : login APPELLE l'API login
    const login = async (email, password) => {
        const data = await loginApi(email, password);

        const token = data.accessToken;
        const decoded = jwtDecode(token);

        localStorage.setItem("accessToken", token);

        setUser({
            logged: true,
            user_id: decoded.user_id,
            firstname: decoded.firstname,
            lastname: decoded.lastname,
            role: decoded.role
        });

        return { accessToken: token, role: decoded.role };
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch (e) {
            console.warn("Erreur logout API, mais on continue", e);
        }

        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("user_id");
        localStorage.removeItem("firstname");
        localStorage.removeItem("lastname");

        setUser(null);
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export function useAuth() {
    return useContext(AuthContext);
}
