import { useState } from "react";
import { Box, Paper, TextField, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [mail, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await login(mail, password);

            const { accessToken, role } = response;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("role", role);

            navigate("/");
        } catch (error) {
            console.error(error);
            setError("Identifiants incorrects");
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
            <Paper sx={{ p: 4, width: 350 }}>
                <Typography variant="h5" mb={3} textAlign="center">
                    Connexion
                </Typography>

                {error && (
                    <Typography color="error" textAlign="center" mb={2}>
                        {error}
                    </Typography>
                )}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={mail}
                        onChange={(e) => setMail(e.target.value)}
                    />

                    <TextField
                        label="Mot de passe"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Se connecter
                    </Button>
                </form>
            </Paper>
        </Box>
    );
}
