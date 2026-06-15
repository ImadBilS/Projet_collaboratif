import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";

export default function Navbar() {
    const { logout, user } = useAuth();
    const location = useLocation();

    // Ne pas afficher la navbar sur la page login
    if (location.pathname === "/login" || location.pathname === "/unauthorized") {
        return null;
    }

    const handleLogout = () => {
        logout();
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

                {/* --- Logo / Titre --- */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "white",
                        fontWeight: "bold",
                        letterSpacing: 1,
                    }}
                >
                    Admin Panel
                </Typography>

                {/* --- Liens de navigation --- */}
                <Box sx={{ display: "flex", gap: 3 }}>
                    <Button component={Link} to="/" color="inherit">
                        Dashboard
                    </Button>

                    <Button component={Link} to="/ressources" color="inherit">
                        Ressources
                    </Button>

                    <Button component={Link} to="/users" color="inherit">
                        Utilisateurs
                    </Button>
                </Box>

                {/* --- Bouton Déconnexion --- */}
                {user && (
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                        sx={{
                            fontWeight: "bold",
                            "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        }}
                    >
                        Déconnexion
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
}
