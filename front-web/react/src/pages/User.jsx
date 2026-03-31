import { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

import { Trash2 } from "lucide-react";

import {
    getAllUsers,
    updateUserRole,
    deleteUserProfile
} from "../api/users";
import { getMe } from "../api/auth";
import CreateUserModal from "../modal/CreateUser";


export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    // Charger les utilisateurs + l'utilisateur connecté
    const loadUsers = async () => {
        const resMe = await getMe();
        const me = resMe.user;

        const res = await getAllUsers();
        const all = res.users;

        const filtered = all.filter((u) => u.user_id !== me.user_id);
        setUsers(filtered);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // Modifier le rôle
    const handleRoleChange = async (userId, newRole) => {
        await updateUserRole(userId, newRole);

        setUsers((prev) =>
            prev.map((u) =>
                u.user_id === userId ? { ...u, role: newRole } : u
            )
        );
    };

    // Ouvrir modal suppression
    const openDelete = (user) => {
        setSelectedUser(user);
        setOpenDeleteModal(true);
    };

    // Confirmer suppression
    const confirmDelete = async () => {
        await deleteUserProfile(selectedUser.user_id);

        setUsers((prev) =>
            prev.filter((u) => u.user_id !== selectedUser.user_id)
        );

        setOpenDeleteModal(false);
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>
                Gestion des utilisateurs
            </Typography>

            {/* BOUTON + MODAL DE CREATION */}
            <CreateUserModal onCreated={loadUsers} />

            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nom</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Rôle</strong></TableCell>
                            <TableCell><strong>Actions</strong></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((u) => (
                            <TableRow key={u.user_id}>
                                <TableCell>
                                    {u.firstname} {u.lastname}
                                </TableCell>

                                <TableCell>{u.mail}</TableCell>

                                <TableCell>
                                    <Select
                                        value={u.role}
                                        onChange={(e) =>
                                            handleRoleChange(u.user_id, e.target.value)
                                        }
                                        size="small"
                                    >
                                        <MenuItem value="Administrateur">Administrateur</MenuItem>
                                        <MenuItem value="Modérateur">Modérateur</MenuItem>
                                        <MenuItem value="Citoyen">Citoyen</MenuItem>
                                    </Select>
                                </TableCell>

                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => openDelete(u)}
                                    >
                                        <Trash2 size={20} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* MODAL DE CONFIRMATION */}
            <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <DialogTitle>Supprimer l’utilisateur</DialogTitle>

                <DialogContent>
                    <Typography>
                        Es-tu sûr de vouloir supprimer le compte de{" "}
                        <strong>{selectedUser?.firstname} {selectedUser?.lastname}</strong>?
                    </Typography>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDeleteModal(false)}>Annuler</Button>

                    <Button
                        color="error"
                        variant="contained"
                        onClick={confirmDelete}
                    >
                        Supprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
