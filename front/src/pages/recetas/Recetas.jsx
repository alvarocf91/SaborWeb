import { useCallback, useContext, useEffect, useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Box,
    Button,
    MenuItem,
    Select,
    FormControl,
    Paper,
} from "@mui/material";
import { SaborwebContext } from "../../context/SaborwebProvider";
import { useApi } from "../../context/ApiProvider";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TimerOffIcon from "@mui/icons-material/TimerOff";
import TuneIcon from "@mui/icons-material/Tune";
import NoFoodIcon from "@mui/icons-material/NoFood";
import RecetaCard from "../../components/RecetaCard";

export default function Recetas() {
    const { recetas, setRecetas, cargaRecetas, dificultades } = useContext(SaborwebContext);
    const {
        obtenerAlergenos,
        obtenerRecetas,
    } = useApi();

    const [loading, setLoading] = useState(false);
    const [alergenos, setAlergenos] = useState([]);
    const [error, setError] = useState(null);

    const [selectedDificultad, setSelectedDificultad] = useState("");
    const [selectedAlergeno, setSelectedAlergeno] = useState("");
    const [selectedOrden, setSelectedOrden] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const puedeCrearReceta = user && (user.role === "user" || user.role === "admin");

    const filterButtonSx = (active = false) => ({
        minHeight: 42,
        textTransform: "none",
        fontWeight: 700,
        borderRadius: 2,
        px: 2.25,
        color: active ? "#ffffff" : "#1D70B8",
        backgroundColor: active ? "#1D70B8" : "#ffffff",
        border: "1px solid rgba(29, 112, 184, 0.22)",
        boxShadow: active ? "0 8px 18px rgba(29, 112, 184, 0.22)" : "none",
        "&:hover": {
            backgroundColor: active ? "#155f9f" : "#F3F8FC",
            borderColor: "#1D70B8",
            boxShadow: active ? "0 10px 22px rgba(29, 112, 184, 0.25)" : "0 4px 12px rgba(29, 112, 184, 0.10)",
        },
        "&.Mui-disabled": {
            color: active ? "#ffffff" : "rgba(29, 112, 184, 0.55)",
            backgroundColor: active ? "#1D70B8" : "#ffffff",
            opacity: 0.65,
        }
    });

    const selectSx = (active = false) => ({
        minHeight: 42,
        backgroundColor: active ? "#EAF3FB" : "#ffffff",
        borderRadius: 2,
        fontWeight: 700,
        color: "#174C7C",
        ".MuiSelect-select": {
            py: 1.15,
            display: "flex",
            alignItems: "center",
        },
        ".MuiOutlinedInput-notchedOutline": {
            borderColor: active ? "#1D70B8" : "rgba(29, 112, 184, 0.22)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1D70B8",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1D70B8",
            borderWidth: 1.5,
        },
    });

    const renderSelectValue = (icon, fallback) => (value) => (
        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 0 }}>
            {icon}
            <Typography
                component="span"
                sx={{
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                {value || fallback}
            </Typography>
        </Box>
    );

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
            setError("Error al cargar los alérgenos");
            setAlergenos([]);
        }
    };

    const fetchRecetasConApi = useCallback(async (apiFunction, ...params) => {
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
                setError("No se encontraron recetas");
            }
        } catch (error) {
            console.error("Error al cargar recetas:", error);
            setError(error.message || "Error al cargar las recetas");
            setRecetas([]);
        } finally {
            setLoading(false);
        }
    }, [setRecetas]);

    const fetchRecetasFiltradas = useCallback((filtros) => {
        return fetchRecetasConApi(obtenerRecetas, filtros);
    }, [fetchRecetasConApi, obtenerRecetas]);

    const buildFiltros = useCallback((overrides = {}) => ({
        dificultad: selectedDificultad,
        alergeno: selectedAlergeno,
        orden: selectedOrden,
        ...overrides,
    }), [selectedAlergeno, selectedDificultad, selectedOrden]);

    useEffect(() => {
        const handleFocus = () => {
            fetchRecetasFiltradas(buildFiltros());
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [buildFiltros, fetchRecetasFiltradas]);

    const handleDificultadChange = (event) => {
        const dificultad = event.target.value;
        setSelectedDificultad(dificultad);
        fetchRecetasFiltradas(buildFiltros({ dificultad }));
    };

    const handleAlergenoChange = (event) => {
        const alergeno = event.target.value;
        setSelectedAlergeno(alergeno);
        fetchRecetasFiltradas(buildFiltros({ alergeno }));
    };

    const handleResetFilters = () => {
        setSelectedDificultad("");
        setSelectedAlergeno("");
        setSelectedOrden("");
        fetchRecetasFiltradas({});
    };

    const handleMasTiempo = () => {
        const orden = selectedOrden === "masTiempo" ? "" : "masTiempo";
        setSelectedOrden(orden);
        fetchRecetasFiltradas(buildFiltros({ orden }));
    };

    const handleMenosTiempo = () => {
        const orden = selectedOrden === "menosTiempo" ? "" : "menosTiempo";
        setSelectedOrden(orden);
        fetchRecetasFiltradas(buildFiltros({ orden }));
    };

    const hasActiveFilters = selectedDificultad || selectedAlergeno || selectedOrden;

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
                        Intentar de nuevo
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
                        Explora creaciones culinarias
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
                        Descubre una colección de recetas de nuestra comunidad. Filtra por dificultad, tiempo de preparación y preferencias alimentarias para encontrar tu plato perfecto.
                    </Typography>
                </Box>
            </Box>

            {/* Advanced Filters Section */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 2, sm: 2.5, md: 3 },
                    mb: 5,
                    borderRadius: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.92)",
                    border: "1px solid rgba(29, 112, 184, 0.12)",
                    boxShadow: "0 10px 28px rgba(24, 78, 119, 0.07)",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        mb: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1.2}>
                        <TuneIcon sx={{ color: "#1D70B8", fontSize: 22 }} />
                        <Typography sx={{ color: "#17324D", fontWeight: 800 }}>
                            Filtros
                        </Typography>
                        {loading && (
                            <Typography variant="caption" sx={{ color: "#5F7891", fontWeight: 700 }}>
                                Actualizando...
                            </Typography>
                        )}
                    </Box>
                    <Button
                        startIcon={<RestartAltIcon />}
                        variant="outlined"
                        onClick={handleResetFilters}
                        disabled={loading || !hasActiveFilters}
                        sx={filterButtonSx(false)}
                    >
                        Todas
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, minmax(0, 1fr))",
                            md: "repeat(4, minmax(0, auto))",
                        },
                        gap: 1.5,
                        alignItems: "center",
                    }}
                >

                    <Button
                        startIcon={<AccessTimeIcon />}
                        variant="outlined"
                        onClick={handleMasTiempo}
                        disabled={loading}
                        sx={filterButtonSx(selectedOrden === "masTiempo")}
                    >
                        Más tiempo
                    </Button>

                    <Button
                        startIcon={<TimerOffIcon />}
                        variant="outlined"
                        onClick={handleMenosTiempo}
                        disabled={loading}
                        sx={filterButtonSx(selectedOrden === "menosTiempo")}
                    >
                        Menos tiempo
                    </Button>

                    <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 190 } }}>
                        <Select
                            id="dificultad-filter"
                            value={selectedDificultad}
                            onChange={handleDificultadChange}
                            disabled={loading}
                            displayEmpty
                            renderValue={renderSelectValue(<TuneIcon sx={{ fontSize: 18, color: "#1D70B8" }} />, "Dificultad")}
                            sx={selectSx(Boolean(selectedDificultad))}
                        >
                            <MenuItem value="">
                                <Box display="flex" alignItems="center">
                                    <TuneIcon sx={{ fontSize: 18, mr: 1 }} /> Todas
                                </Box>
                            </MenuItem>
                            {dificultades.map((dificultad) => (
                                <MenuItem value={dificultad.dificultad} key={dificultad.dificultad}>
                                    {dificultad.dificultad}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: { xs: "100%", md: 210 } }}>
                        <Select
                            id="alergenos-filter"
                            value={selectedAlergeno}
                            onChange={handleAlergenoChange}
                            disabled={loading}
                            displayEmpty
                            renderValue={renderSelectValue(<NoFoodIcon sx={{ fontSize: 18, color: "#1D70B8" }} />, "Sin alérgenos")}
                            sx={selectSx(Boolean(selectedAlergeno))}
                        >
                            <MenuItem value="">
                                <Box display="flex" alignItems="center">
                                    <NoFoodIcon sx={{ fontSize: 18, mr: 1 }} /> Todos
                                </Box>
                            </MenuItem>
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

            <Grid
                container
                spacing={4}
                justifyContent="center"
                sx={{
                    opacity: loading ? 0.58 : 1,
                    transition: "opacity 0.2s ease",
                }}
            >
                {recetas.length === 0 && !error ? (
                    <Typography variant="h6" color="text.secondary">
                        No se encontraron recetas.
                    </Typography>
                ) : (
                    recetas.map((receta) => (
                        <RecetaCard receta={receta} key={receta.id} />
                    ))
                )}
            </Grid>

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
                        Crear nueva receta
                    </Button>
                </Link>
            )}
        </Container>
    );
}
