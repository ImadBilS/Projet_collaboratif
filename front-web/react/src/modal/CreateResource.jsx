import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import FormModal from "../components/FormModal";
import { createRessource } from "../api/ressources";
import { allowedVisibilities, allowedCategories } from "../constants/ressourceOptions";

export default function CreateResourceModal({ onCreated }) {
    const [open, setOpen] = useState(false);

    const fields = [
        { name: "wording", label: "Titre", type: "text" },
        { name: "description", label: "Description", type: "text" },
        { name: "city", label: "Ville", type: "text" },

        {
            name: "visibility",
            label: "Visibilité",
            type: "select",
            options: allowedVisibilities.map((v) => ({
                value: v,
                label: v.charAt(0) + v.slice(1).toLowerCase(),
            })),
        },

        {
            name: "category",
            label: "Catégorie",
            type: "select",
            options: allowedCategories.map((c) => ({
                value: c,
                label: c.replaceAll("_", " ").toLowerCase().replace(/^\w/, (x) => x.toUpperCase()),
            })),
        },
    ];

    const handleSubmit = async (values) => {
        await createRessource(values);
        if (onCreated) onCreated();
        alert("Ressource créée !");
    };

    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
                Ajouter une ressource
            </Button>

            <FormModal
                open={open}
                onClose={() => setOpen(false)}
                title="Créer une ressource"
                fields={fields}
                onSubmit={handleSubmit}
                submitLabel="Créer"
            />
        </>
    );
}

CreateResourceModal.propTypes = {
    onCreated: PropTypes.func,
};
