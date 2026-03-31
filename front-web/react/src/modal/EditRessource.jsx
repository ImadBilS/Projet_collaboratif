import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FormModal from "../components/FormModal";
import { updateRessource } from "../api/ressources";
import { allowedVisibilities, allowedCategories } from "../constants/ressourceOptions";

export default function EditResourceModal({ resource, open, onClose, onUpdated }) {
    const [fields, setFields] = useState([]);
    
    useEffect(() => {
        if (resource) {            
            setFields([
                { name: "wording", label: "Titre", type: "text", defaultValue: resource.wording },
                { name: "description", label: "Description", type: "text", defaultValue: resource.description },
                { name: "city", label: "Ville", type: "text", defaultValue: resource.city },

                {
                    name: "visibility",
                    label: "Visibilité",
                    type: "select",
                    defaultValue: resource.visibility,
                    options: allowedVisibilities.map((v) => ({
                        value: v,
                        label: v.charAt(0) + v.slice(1).toLowerCase(),
                    })),
                },

                {
                    name: "category",
                    label: "Catégories",
                    type: "multiselect",
                    defaultValue: Array.isArray(resource.category)
                        ? resource.category
                        : [resource.category], // toujours un tableau
                        options: allowedCategories.map((c) => ({
                            value: c,
                            label: c
                            .replaceAll("_", " ")
                            .toLowerCase()
                            .replace(/^\w/, (x) => x.toUpperCase()),
                    })),
                }
            ]);
        }
    }, [resource]);
    
    const handleSubmit = async (values) => {
        console.log("Updating resource with values:", values);
        await updateRessource(resource.ressource_id, values);
        if (onUpdated) onUpdated();
        onClose();
    };

    return (
        <FormModal
            open={open}
            onClose={onClose}
            title="Modifier la ressource"
            titleVariant="h5"
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel="Mettre à jour"
        />
    );
}

EditResourceModal.propTypes = {
    resource: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpdated: PropTypes.func,
};
