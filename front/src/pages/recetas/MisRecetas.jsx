import { useState, useEffect, useContext } from "react";
import {
    Container,
    Typography,
    Grid,
    Box,
    Paper,
    Snackbar,
    Alert,
    Button
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddIcon from "@mui/icons-material/Add";
import MisRecetasCard from "../../components/MisRecetasCard";
import { SaborwebContext } from "../../context/SaborwebProvider";
import { useApi } from "../../context/ApiProvider";
import { useLanguage } from "../../hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/Spinner";

export default function MisRecetas() {
    const [misRecetas, setMisRecetas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success"
    });

    const { t } = useLanguage();
    const [user] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user"));
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            return null;
        }
    });

    const { setReceta } = useContext(SaborwebContext);
    const { obtenerRecetasPorUsuario, eliminarReceta } = useApi();
    const navigation = useNavigate();

    useEffect(() => {
        cargarRecetas();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            cargarRecetas();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const cargarRecetas = async () => {
        if (!user || !user.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const response = await obtenerRecetasPorUsuario(user.id);

            if (response && response.data) {
                setMisRecetas(response.data);
            } else if (Array.isArray(response)) {
                setMisRecetas(response);
            } else {
                console.warn("Estructura de respuesta inesperada:", response);
                setMisRecetas([]);
            }
        } catch (error) {
            console.error('Error al cargar recetas:', error);
            setMisRecetas([]);
            setSnackbar({
                open: true,
                message: `Error al cargar las recetas: ${error.message}`,
                severity: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveReceta = async (id) => {
        try {
            await eliminarReceta(id);
            setMisRecetas(prevRecetas => prevRecetas.filter(receta => receta.id !== id));
            setSnackbar({
                open: true,
                message: "Receta eliminada correctamente",
                severity: "success"
            });
        } catch (error) {
            console.error("Error al eliminar receta:", error);
            setSnackbar({
                open: true,
                message: `Error al eliminar la receta: ${error.message}`,
                severity: "error"
            });
        }
    };

    const handleEditReceta = (receta) => {
        setReceta(receta);
        navigation("/edit-recipe");
        console.log("Editando receta:", receta.id);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Timeout de carga alcanzado");
                setLoading(false);
                setSnackbar({
                    open: true,
                    message: "Se ha superado el tiempo de carga. Intenta recargar la página.",
                    severity: "warning"
                });
            }
        }, 10000);

        return () => clearTimeout(timeoutId);
    }, [loading]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, p: 3, textAlign: 'center' }}>
                <Spinner />
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {t('myRecipes.loading')}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, p: 3, position: "relative" }}>
            <Box mb={6} textAlign="center">
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                        color: '#1D70B8',
                        fontWeight: 'bold',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '60%',
                            height: '4px',
                            bottom: '-10px',
                            left: '20%',
                            backgroundColor: '#1D70B8',
                            borderRadius: '2px'
                        }
                    }}
                >
                    {t('myRecipes.title')}
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        maxWidth: '700px',
                        mx: 'auto',
                        mt: 3,
                        fontSize: '1.1rem'
                    }}
                >
                    {t('myRecipes.subtitle')}
                </Typography>
                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigation('/create-recipe')}
                        sx={{
                            borderRadius: 3,
                            px: 3,
                            py: 1.2,
                            backgroundColor: '#1D70B8',
                            '&:hover': { backgroundColor: '#1D70B8' }
                        }}
                    >
                        {t('recipes.create')}
                    </Button>
                </Box>
            </Box>

            {misRecetas.length === 0 ? (
                <Paper
                    elevation={1}
                    sx={{
                        p: 5,
                        borderRadius: 2,
                        textAlign: "center",
                        backgroundColor: "#f9f9f9"
                    }}
                >
                    <FavoriteBorderIcon sx={{ fontSize: 60, color: "#bdbdbd", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                        {t('myRecipes.noRecipes')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {t('myRecipes.createSome')}
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
                    {misRecetas.map((receta) => (
                        <Grid item xs={6} sm={6} md={3} display="flex" justifyContent="center" key={receta.id}>
                            <MisRecetasCard
                                receta={receta}
                                onRemove={handleRemoveReceta}
                                onEdit={handleEditReceta}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
