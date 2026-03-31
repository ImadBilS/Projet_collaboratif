import { useEffect, useState } from "react";
import {
    Grid,
    Paper,
    Typography,
    Box,
    Divider,
    Avatar,
    Chip,
    Button, Tooltip
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { Eye, MessageSquare, Heart, Layers } from "lucide-react";
import { getStats } from "../api/stats";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalResources: 0,
        totalViews: 0,
        totalComments: 0,
        totalReactions: 0,
        mostViewed: [],
        activeUsers: [],
        resourcesByCity: [],
    });
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();

        // 1) KPI
        const kpiSheet = XLSX.utils.json_to_sheet([
            {
                "Ressources publiées": stats.totalResources,
                "Vues totales": stats.totalViews,
                "Commentaires": stats.totalComments,
                "Réactions": stats.totalReactions
            }
        ]);
        XLSX.utils.book_append_sheet(wb, kpiSheet, "KPI");

        // 2) Ressources les plus vues
        const mostViewedSheet = XLSX.utils.json_to_sheet(stats.mostViewed);
        XLSX.utils.book_append_sheet(wb, mostViewedSheet, "Ressources vues");

        // 3) Utilisateurs actifs
        const activeUsersSheet = XLSX.utils.json_to_sheet(
            stats.activeUsers.map(u => ({
                user_id: u.user_id,
                firstname: u.firstname,
                lastname: u.lastname,
                ressources: u._count.resources,
                commentaires: u._count.comments,
                reactions: u._count.reactions
            }))
        );
        XLSX.utils.book_append_sheet(wb, activeUsersSheet, "Utilisateurs actifs");

        // 4) Ressources par ville
        const citySheet = XLSX.utils.json_to_sheet(stats.resourcesByCity);
        XLSX.utils.book_append_sheet(wb, citySheet, "Ressources par ville");

        // Export
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "stats_plateforme.xlsx");
    };



    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStats()
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch stats:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <Typography color="text.secondary" sx={{ mt: 4 }}>
                Chargement des données...
            </Typography>
        );
    }

    return (
        <Box>
            {/* HEADER */}
            <Box
                sx={{
                    position: "relative",
                    mb: 5,
                    textAlign: "center"
                }}
            >
                {/* Bouton export à droite */}
                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                    <Tooltip title="Exporter les statistiques" arrow>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={exportToExcel}
                            sx={{
                                minWidth: 48,
                                width: 48,
                                height: 48,
                                marginRight: 3,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundImage: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                                transition: "0.3s ease",
                                "&:hover": {
                                    backgroundImage: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                                    transform: "translateY(-3px)",
                                    boxShadow: "0 6px 14px rgba(0,0,0,0.25)"
                                }
                            }}
                        >
                            <DownloadIcon sx={{ fontSize: 24 }} />
                        </Button>
                    </Tooltip>
                </Box>

                {/* Titre */}
                <Typography
                    variant="h4"
                    fontWeight="700"
                    sx={{
                        transition: "0.3s ease",
                        "&:hover": {
                            color: "primary.main",
                            textShadow: "0 0 6px rgba(25,118,210,0.4)"
                        }
                    }}
                >
                    Tableau de bord
                </Typography>

                {/* Sous-titre */}
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{
                        mt: 1,
                        transition: "0.3s ease",
                        "&:hover": {
                            color: "primary.main"
                        }
                    }}
                >
                    Vue d’ensemble de l’activité de la plateforme
                </Typography>
            </Box>

            {/* KPI CARDS */}
            <Grid container
                spacing={3}
                mb={4}
                justifyContent="center">
                {[
                    {
                        label: "Ressources publiées",
                        value: stats.totalResources,
                        icon: <Layers size={28} color="#1976d2" />,
                        color: "primary.light",
                    },
                    {
                        label: "Vues totales",
                        value: stats.totalViews,
                        icon: <Eye size={28} color="#2e7d32" />,
                        color: "success.light",
                    },
                    {
                        label: "Commentaires",
                        value: stats.totalComments,
                        icon: <MessageSquare size={28} color="#ed6c02" />,
                        color: "warning.light",
                    },
                    {
                        label: "Réactions",
                        value: stats.totalReactions,
                        icon: <Heart size={28} color="#d32f2f" />,
                        color: "error.light",
                    },
                ].map((item) => (
                    <Grid item xs={12} md={3} key={item.label}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                transition: "0.2s",
                                "&:hover": { transform: "translateY(-4px)" },
                            }}
                        >
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    {item.label}
                                </Typography>
                                <Typography variant="h4" fontWeight="bold">
                                    {item.value}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    bgcolor: item.color,
                                    p: 1.5,
                                    borderRadius: "50%",
                                }}
                            >
                                {item.icon}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* MOST VIEWED RESOURCES */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, mx: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Ressources les plus vues
                </Typography>

                {stats.mostViewed?.map((r) => (
                    <Box key={r.ressource_id} sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight="500">{r.wording}</Typography>
                            <Chip
                                label={`${r.views} vues`}
                                color="primary"
                                size="small"
                                sx={{ fontWeight: "bold" }}
                            />
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                    </Box>
                ))}
            </Paper>

            {/* ACTIVE USERS */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, mx: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Utilisateurs les plus actifs
                </Typography>

                {stats.activeUsers?.map((u) => (
                    <Box key={u.user_id} sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar>
                                    {u.firstname[0]}
                                    {u.lastname[0]}
                                </Avatar>
                                <Typography fontWeight="500">
                                    {u.firstname} {u.lastname}
                                </Typography>
                            </Box>

                            <Typography color="text.secondary">
                                {u._count.resources} ressources • {u._count.comments} commentaires •{" "}
                                {u._count.reactions} réactions
                            </Typography>
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                    </Box>
                ))}
            </Paper>

            {/* RESOURCES BY CITY */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, mx: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                    Répartition des ressources par ville
                </Typography>

                {stats.resourcesByCity?.map((c) => (
                    <Box key={c.city} sx={{ py: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight="500">{c.city}</Typography>
                            <Chip
                                label={`${c.total} ressources`}
                                variant="outlined"
                                color="primary"
                            />
                        </Box>
                        <Divider sx={{ mt: 1 }} />
                    </Box>
                ))}
            </Paper>
        </Box>
    );
}
