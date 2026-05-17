import { useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Paper,
} from "@mui/material";
import { SaborwebContext } from "../../context/SaborifyProvider";
import { useApi } from "../../context/ApiProvider";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import TuneIcon from "@mui/icons-material/Tune";
import NoFoodIcon from "@mui/icons-material/NoFood";
import RecetaCard from "../../components/RecetaCard";
import Spinner from "../../components/Spinner";

export default function Recetas() {
    const { recetas, setRecetas, cargaRecetas, dificultades } = useContext(SaborwebContext);
    const {
        obtenerAlergenos,
        obtenerRecetas,
        obtenerRecetasPorDificultad,
        obtenerRecetasSinAlergeno,
        obtenerRecetasMasTiempo,
        obtenerRecetasMenosTiempo
    } = useApi();

    const [loading, setLoading] = useState(false);
    const [alergenos, setAlergenos] = useState([]);
    const [error, setError] = useState(null);

    const [selectedDificultad, setSelectedDificultad] = useState("");
    const [selectedAlergeno, setSelectedAlergeno] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const puedeCrearReceta = user && (user.role === "user" || user.role === "admin");

    useEffect(() => {
        cargaRecetas();
        cargarAlergenos();
    }, []);

    const cargarAlergenos = async () => {
        try {
            setError(null);
            const result = await obtenerAlergenos();

            if (result && Array.isArray(result)) {
                setAlergenos(result);
            } else if (result && result.data && Array.isArray(result.data)) {
                setAlergenos(result.data);
            } else {
                console.error("Respuesta inválida para alérgenos", result);
                setAlergenos([]);
            }
        } catch (error) {
            console.error("Error al cargar alérgenos:", error);
            setError("Error loading allergens");
            setAlergenos([]);
        }
    };

    const fetchRecetasConApi = async (apiFunction, ...params) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiFunction(...params);

            if (result && result.data && Array.isArray(result.data)) {
                setRecetas(result.data);
            } else if (result && Array.isArray(result)) {
                setRecetas(result);
            } else {
                console.error("Respuesta inválida del backend", result);
                setRecetas([]);
                setError("No recipes found");
            }
        } catch (error) {
            console.error("Error al cargar recetas:", error);
            setError(error.message || "Error loading recipes");
            setRecetas([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDificultadChange = (event) => {
        const dificultad = event.target.value;
        setSelectedDificultad(dificultad);
        setSelectedAlergeno("");
        fetchRecetasConApi(obtenerRecetasPorDificultad, dificultad);
    };

    const handleAlergenoChange = (event) => {
        const alergeno = event.target.value;
        setSelectedAlergeno(alergeno);
        setSelectedDificultad("");
        fetchRecetasConApi(obtenerRecetasSinAlergeno, alergeno);
    };

    const handleResetFilters = () => {
        setSelectedDificultad("");
        setSelectedAlergeno("");
        fetchRecetasConApi(obtenerRecetas);
    };

    const handleMasTiempo = () => {
        setSelectedDificultad("");
        setSelectedAlergeno("");
        fetchRecetasConApi(obtenerRecetasMasTiempo);
    };

    const handleMenosTiempo = () => {
        setSelectedDificultad("");
        setSelectedAlergeno("");
        fetchRecetasConApi(obtenerRecetasMenosTiempo);
    };

    const renderErrorMessage = () => {
        if (error) {
            return (
                <Box
                    sx={{
                        textAlign: "center",
                        py: 4,
                        backgroundColor: "#EAF3FB",
                        borderRadius: 2,
                        mb: 2
                    }}
                >
                    <Typography variant="body1" color="error">
                        {error}
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={handleResetFilters}
                        sx={{ mt: 2 }}
                    >
                        Try again
                    </Button>
                </Box>
            );
        }
        return null;
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 } }}>
            {/* Hero Section */}
            <Box 
                mb={{ xs: 6, sm: 8, md: 10 }}
                sx={{
                    textAlign: "center",
                    position: "relative",
                    px: { xs: 2, sm: 3 },
                    py: { xs: 4, sm: 5, md: 6 },
                    borderRadius: { xs: 4, sm: 6 },
                    background: "linear-gradient(135deg, #ffffff 0%, #f9fcff 50%, #f0f8ff 100%)",
                    border: "1px solid rgba(29, 112, 184, 0.08)",
                    boxShadow: "0 4px 20px rgba(29, 112, 184, 0.06)",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        background: "radial-gradient(circle, rgba(29, 112, 184, 0.05) 0%, transparent 70%)",
                    }
                }}
            >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            color: '#1D70B8',
                            fontWeight: 800,
                            position: 'relative',
                            display: 'inline-block',
                            fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' },
                            mb: { xs: 2, sm: 2.5, md: 3 },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                width: '70px',
                                height: '5px',
                                bottom: '-12px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                backgroundColor: '#1D70B8',
                                borderRadius: '3px',
                                background: 'linear-gradient(90deg, #1D70B8, #00a0ff)'
                            }
                        }}
                    >
                        Explore Culinary Creations
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                            maxWidth: '750px',
                            mx: 'auto',
                            mt: 4,
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                            lineHeight: 1.7
                        }}
                    >
                        Discover a curated collection of recipes from our community. Filter by difficulty, preparation time, and dietary preferences to find your perfect dish.
                    </Typography>
                </Box>
            </Box>

            {/* Advanced Filters Section */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 4, md: 5 },
                    mb: 5,
                    borderRadius: 4,
                    backgroundColor: "#ffffff",
                    border: "1px solid rgba(29, 112, 184, 0.08)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
            >
                <Box display="flex" alignItems="center" justifyContent="center" gap={2} flexWrap="wrap">
                    <Button
                        startIcon={<RestartAltIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleResetFilters}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2.5,
                            backgroundColor: "#1D70B8",
                            px: 2.5,
                            py: 1.2,
                            fontSize: '0.9rem',
                            boxShadow: "0 4px 12px rgba(29, 112, 184, 0.3)",
                            transition: "all 0.3s ease",
                            "&:hover": { 
                                backgroundColor: "#0059b3",
                                boxShadow: "0 6px 20px rgba(29, 112, 184, 0.4)",
                                transform: "translateY(-2px)"
                            },
                        }}
                    >
                        All
                    </Button>

                    <Button
                        startIcon={<AccessTimeIcon />}
                        variant="outlined"
                        onClick={handleMasTiempo}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2.5,
                            color: "#1D70B8",
                            borderColor: "#1D70B8",
                            px: 2.5,
                            py: 1.2,
                            fontSize: '0.9rem',
                            border: "1.5px solid #1D70B8",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(29, 112, 184, 0.08)",
                                borderColor: "#0059b3",
                                color: "#0059b3",
                                boxShadow: "0 4px 12px rgba(29, 112, 184, 0.15)",
                            },
                        }}
                    >
                        More Time
                    </Button>

                    <Button
                        startIcon={<TimerOffIcon />}
                        variant="outlined"
                        onClick={handleMenosTiempo}
                        disabled={loading}
                        sx={{
                            textTransform: "none",
                            fontWeight: 600,
                            borderRadius: 2.5,
                            color: "#1D70B8",
                            borderColor: "#1D70B8",
                            px: 2.5,
                            py: 1.2,
                            fontSize: '0.9rem',
                            border: "1.5px solid #1D70B8",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                backgroundColor: "rgba(29, 112, 184, 0.08)",
                                borderColor: "#0059b3",
                                color: "#0059b3",
                                boxShadow: "0 4px 12px rgba(29, 112, 184, 0.15)",
                            },
                        }}
                    >
                        Less Time
                    </Button>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel sx={{ color: "#1D70B8", fontWeight: 600 }}>
                            <Box display="flex" alignItems="center">
                                <TuneIcon sx={{ fontSize: 18, mr: 1 }} /> Difficulty
                            </Box>
                        </InputLabel>
                        <Select
                            label="Difficulty"
                            value={selectedDificultad}
                            onChange={handleDificultadChange}
                            disabled={loading}
                            sx={{
                                backgroundColor: "#f9fcff",
                                borderRadius: 2.5,
                                border: "1.5px solid rgba(29, 112, 184, 0.3)",
                                fontWeight: 500,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#1D70B8",
                                    backgroundColor: "#ffffff",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#1D70B8",
                                }
                            }}
                        >
                            {dificultades.map((dificultad) => (
                                <MenuItem value={dificultad.dificultad} key={dificultad.dificultad}>
                                    {dificultad.dificultad}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 180 }} id="alergenos-select">
                        <InputLabel sx={{ color: "#1D70B8", fontWeight: 600 }}>
                            <Box display="flex" alignItems="center">
                                <NoFoodIcon sx={{ fontSize: 18, mr: 1 }} /> Without allergens
                            </Box>
                        </InputLabel>
                        <Select
                            label="Without allergens"
                            value={selectedAlergeno}
                            onChange={handleAlergenoChange}
                            disabled={loading}
                            sx={{
                                backgroundColor: "#f9fcff",
                                borderRadius: 2.5,
                                border: "1.5px solid rgba(29, 112, 184, 0.3)",
                                fontWeight: 500,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#1D70B8",
                                    backgroundColor: "#ffffff",
                                },
                                "&.Mui-focused": {
                                    borderColor: "#1D70B8",
                                }
                            }}
                        >
                            {alergenos.map((alergeno) => (
                                <MenuItem value={alergeno.nombre} key={alergeno.id}>
                                    {alergeno.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Paper>

            {renderErrorMessage()}

            {loading ? (
                <Spinner />
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {recetas.length === 0 && !error ? (
                        <Typography variant="h6" color="text.secondary">
                            No recipes found.
                        </Typography>
                    ) : (
                        recetas.map((receta) => (
                            <RecetaCard receta={receta} key={receta.id} />
                        ))
                    )}
                </Grid>
            )}

            {puedeCrearReceta && (
                <Link to="/create-recipe" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            position: "fixed",
                            bottom: 60,
                            right: 40,
                            px: 3,
                            py: 1.5,
                            fontSize: "16px",
                            fontWeight: "bold",
                            textTransform: "none",
                            borderRadius: "30px",
                            boxShadow: "0px 8px 24px rgba(29, 112, 184, 0.35)",
                            backgroundColor: "#1D70B8",
                            color: "#fff",
                            transition: "all 0.3s cubic-bezier(0.23, 1, 0.320, 1)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            "&:hover": {
                                backgroundColor: "#0059b3",
                                transform: "scale(1.08) translateY(-3px)",
                                boxShadow: "0px 12px 32px rgba(29, 112, 184, 0.45)",
                            },
                        }}
                    >
                        Create new recipe
                    </Button>
                </Link>
            )}
        </Container>
    );
}