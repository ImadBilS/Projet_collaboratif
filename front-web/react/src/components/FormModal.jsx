import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    FormControl,
    InputLabel,
    Select,
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";


function FormModal({
    open,
    onClose,
    title,
    fields,
    onSubmit,
    submitLabel = "Valider"
}) {
    const [values, setValues] = useState({});

    useEffect(() => {
        const initialValues = {};
        fields.forEach((f) => {
            initialValues[f.name] = f.defaultValue ?? (f.type === "multiselect" ? [] : "");
        });
        setValues(initialValues);
    }, [fields, open]);

    const handleChange = (name, value) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onSubmit(values);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ color: "#000", fontWeight: "bold" }}>
                {title}
            </DialogTitle>

            <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
                {fields.map((field) => (
                    <Box key={field.name}>
                        {field.type === "multiselect" && (
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    multiple
                                    value={values[field.name] || []}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    label={field.label}
                                >
                                    {field.options.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {field.type === "select" && (
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel>{field.label}</InputLabel>
                                <Select
                                    value={values[field.name] ?? ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    label={field.label}
                                >
                                    {field.options.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {field.type !== "multiselect" && field.type !== "select" && (
                            <TextField
                                fullWidth
                                type={field.type}
                                label={field.label}
                                value={values[field.name] ?? ""}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                            />
                        )}
                    </Box>
                ))}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Annuler</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

FormModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitLabel: PropTypes.string
};

export default FormModal;
