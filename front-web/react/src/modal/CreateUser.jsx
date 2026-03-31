import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import FormModal from "../components/FormModal";
import { register } from "../api/auth";

export default function CreateUserModal({ onCreated }) {
  const [open, setOpen] = useState(false);

  const fields = [
    { name: "firstname", label: "Prénom", type: "text" },
    { name: "lastname", label: "Nom", type: "text" },
    { name: "mail", label: "Email", type: "email" },
    { name: "password", label: "Mot de passe", type: "password" },

    {
      name: "role",
      label: "Rôle",
      type: "select",
      options: [
        { value: "Citoyen", label: "Citoyen" },
        { value: "Modérateur", label: "Modérateur" },
        { value: "Administrateur", label: "Administrateur" },
      ],
      defaultValue: "Citoyen",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      await register(values);

      if (onCreated) onCreated(); // rafraîchir la liste
      alert("Utilisateur créé !");
    } catch (err) {
      alert(
        "Erreur lors de la création: " +
          (err.response?.data?.message || err.message || "Erreur inconnue")
      );
    }
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2, flex: "start" }}
      >
        Ajouter un utilisateur
      </Button>

      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un utilisateur"
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Créer"
      />
    </>
  );
}

CreateUserModal.propTypes = {
  onCreated: PropTypes.func,
};
