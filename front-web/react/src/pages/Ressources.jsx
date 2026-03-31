import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, Chip, Button } from "@mui/material";
import { getRessources, getRessourceById } from "../api/ressources";
import CreateResourceModal from "../modal/CreateResource";
import EditResourceModal from "../modal/EditRessource";
import { getMe } from "../api/auth";

export default function Resources() {
    const [currentUser, setCurrentUser] = useState(null);

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingResource, setEditingResource] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    useEffect(() => {
        const load = async () => {
            const me = await getMe();   // ← récupère user_id, firstname, lastname, role
            setCurrentUser(me);

            await loadResources();
        };

        load();
    }, []);

    const loadResources = async () => {
        const data = await getRessources();
        setResources(data);
        setLoading(false);
    };

    useEffect(() => {
        loadResources();
    }, []);

    const openEditModal = async (id) => {
        const fullResource = await getRessourceById(id);
        setEditingResource(fullResource);
        setOpenEdit(true);
    };
    if (loading) {
        return <Typography color="text.secondary">Chargement des ressources...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={4}>
                Ressources
            </Typography>

            <CreateResourceModal onCreated={loadResources} />

            <Grid container spacing={3} mb={4} justifyContent="center">
                {resources.map((r) => (
                    <Grid item xs={12} md={6} key={r.ressource_id}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold">
                                {r.wording}
                            </Typography>

                            <Typography component="div" color="text.secondary" sx={{ mt: 1 }}>
                                Visibilité :{" "}
                                <Chip
                                    label={r.visibility}
                                    color={r.visibility === "PUBLIC" ? "success" : "warning"}
                                    size="small"
                                />
                            </Typography>

                            <Typography component="div" sx={{ mt: 1 }}>
                                Créé par : {r.user?.firstname} {r.user?.lastname}
                            </Typography>

                            <Typography component="div" sx={{ mt: 1 }}>
                                Catégories :
                                {r.category.length === 0 ? (
                                    <span style={{ color: "#777" }}> Aucune</span>
                                ) : (
                                    r.category.map((c) => (
                                        <Chip key={c} label={c} size="small" sx={{ ml: 1 }} />
                                    ))
                                )}
                            </Typography>

                            {currentUser?.user.user_id === r.user_id && (
                                <Button
                                    variant="outlined"
                                    sx={{ mt: 2 }}
                                    onClick={() => openEditModal(r.ressource_id)}
                                >
                                    Modifier
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* MODAL EDIT */}
            <EditResourceModal
                resource={editingResource}
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onUpdated={loadResources}
            />
        </Box>
    );
}
