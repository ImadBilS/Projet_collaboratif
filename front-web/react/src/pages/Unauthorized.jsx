import { Typography, Box } from "@mui/material";
import LogoutButton from "../components/LogoutButton";

export default function Unauthorized() {
    return (
        <Box sx={{ mt: 10, textAlign: "center" }}>
            <Typography variant="h4" color="error">
                Accès refusé
            </Typography>
            <Typography color="text.secondary">
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <LogoutButton />
            </Box>
        </Box>
    );
}
