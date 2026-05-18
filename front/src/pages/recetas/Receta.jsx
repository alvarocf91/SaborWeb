import { useContext, useEffect, useMemo, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  Paper,
  Avatar,
  Collapse,
  Fade,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DifficultyIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { SaborwebContext } from "../../context/SaborwebProvider";
import { useApi, API_BASE_URL } from "../../context/ApiProvider";
import { Link } from "react-router-dom";
import ReseñaCard from "../../components/ReseñaCard";
import Spinner from "../../components/Spinner";

const imagenRecetaPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='700' viewBox='0 0 1200 700'%3E%3Crect width='1200' height='700' fill='%23EAF3FB'/%3E%3Ccircle cx='600' cy='300' r='92' fill='%23D6E9F8'/%3E%3Cpath d='M552 284h96v36h-96zM570 250h60v34h-60zM530 330h140v36H530z' fill='%231D70B8'/%3E%3Ctext x='600' y='450' text-anchor='middle' font-family='Arial,sans-serif' font-size='34' font-weight='700' fill='%231D70B8'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: "50px",
  fontWeight: 600,
  padding: "4px 8px",
  textTransform: "capitalize",
  boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  fontSize: { xs: "0.75rem", sm: "0.875rem" },
  [theme.breakpoints.down('sm')]: {
    fontSize: "0.7rem",
    padding: "2px 6px",
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  position: "relative",
  fontWeight: 700,
  color: "#1D70B8",
  marginBottom: theme.spacing(2),
  display: "inline-block",
  fontSize: "1.5rem",
  [theme.breakpoints.down('sm')]: {
    fontSize: "1.25rem",
    marginBottom: theme.spacing(1.5),
  },
  "&:after": {
    content: '""',
    position: "absolute",
    width: "40px",
    height: "3px",
    bottom: "-8px",
    left: 0,
    backgroundColor: "#1D70B8",
    borderRadius: "2px",
    [theme.breakpoints.down('sm')]: {
      width: "30px",
      height: "2px",
      bottom: "-6px",
    },
  },
}));

const RecipeInfoBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  backgroundColor: "#EAF3FB",
  borderRadius: "12px",
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "100%",
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    borderRadius: "8px",
    marginBottom: theme.spacing(1),
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "white",
  borderRadius: "16px",
  padding: theme.spacing(3),
  height: "100%",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  transition: "transform 0.3s ease-in-out",
  [theme.breakpoints.down('sm')]: {
    borderRadius: "12px",
    padding: theme.spacing(2),
  },
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
    [theme.breakpoints.down('sm')]: {
      transform: "none",
    },
  },
}));

export default function Receta() {
  const { receta, setReceta } = useContext(SaborwebContext);
  const api = useApi();
  const user = JSON.parse(localStorage.getItem("user"));
  const [recipeUser, setRecipeUser] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reseñas, setReseñas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [imageIndex, setImageIndex] = useState(0);

  const isUserLoggedIn = () => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    return user && token;
  };

  const isAIGenerated = receta?.IA === true;

  const extractImageUrl = (value) => {
    if (!value) return null;
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      const direct = value.url || value.path || value.ruta || value.nombre;
      if (typeof direct === 'string') return direct;
    }
    return null;
  };

  const imageCandidates = useMemo(() => {
    const raw = extractImageUrl(receta?.imagen_url || receta?.imagen || receta?.imagenUrl);
    if (!raw || typeof raw !== 'string') return [];
    const publicBase = API_BASE_URL.replace(/\/api\/?$/, '');
    const origin = API_BASE_URL.split('/public')[0];
    const normalized = raw.trim();
    const cacheBuster = receta?.imagen_cache || receta?.imagenCache || null;
    const candidates = new Set();
    const add = (value) => {
      if (!value || typeof value !== 'string') return;
      candidates.add(cacheBuster && !value.includes('?') ? `${value}?v=${cacheBuster}` : value);
    };

    add(normalized);
    if (normalized.startsWith('http://')) add(normalized.replace('http://', 'https://'));
    if (/^https?:\/\//.test(normalized) && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) {
      add(normalized.replace('/storage/', '/public/storage/'));
    }
    if (normalized.startsWith('https://') && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) {
      add(normalized.replace('/storage/', '/public/storage/'));
    }
    if (normalized.startsWith('//')) add(`https:${normalized}`);
    if (normalized.startsWith('/storage/')) {
      add(`${publicBase}${normalized}`);
      add(`${origin}${normalized}`);
    }
    if (normalized.startsWith('storage/')) {
      add(`${publicBase}/${normalized}`);
      add(`${origin}/${normalized}`);
    }
    if (normalized.startsWith('/recetas/')) {
      add(`${publicBase}/storage${normalized}`);
      add(`${origin}/storage${normalized}`);
    }
    if (normalized.startsWith('recetas/')) {
      add(`${publicBase}/storage/${normalized}`);
      add(`${origin}/storage/${normalized}`);
    }
    if (normalized.startsWith('/')) add(`${origin}${normalized}`);
    if (!normalized.startsWith('http') && !normalized.startsWith('/')) {
      add(`${publicBase}/storage/${normalized}`);
      add(`${origin}/storage/${normalized}`);
    }

    return Array.from(candidates);
  }, [receta?.imagen_url, receta?.imagen, receta?.imagenUrl, receta?.imagen_cache, receta?.imagenCache]);

  const imagenAMostrar = imageCandidates[imageIndex] || imagenRecetaPlaceholder;

  useEffect(() => {
    setImageIndex(0);
  }, [receta?.imagen_url, receta?.imagen, receta?.imagenUrl]);

  useEffect(() => {
    if (user && user.id && receta && receta.usuario_id) {
      const userId = String(user.id);
      const recetaUserId = String(receta.usuario_id);

      if (userId === recetaUserId) {
        setRecipeUser(true);
      } else {
        setRecipeUser(false);
      }
    } else {
      setRecipeUser(false);
    }

  }, [user, receta]);

  const getTipoComidaDisplay = (tipoComida) => {
    if (!tipoComida) return '-';

    if (Array.isArray(tipoComida)) {
      return tipoComida.length > 0 ? tipoComida[0] : '-';
    }

    return tipoComida;
  };

  const getTiposComidaChips = (tipoComida) => {
    if (!tipoComida) return [];

    if (Array.isArray(tipoComida)) {
      return tipoComida;
    }

    return [tipoComida];
  };

  const checkIfFavorite = (recetaToCheck) => {
    if (!recetaToCheck || !recetaToCheck.id) return false;

    const existingFavs = JSON.parse(localStorage.getItem("recetasFavs")) || [];

    if (recetaToCheck.IA === true) {
      return existingFavs.some(fav =>
        fav.IA === true &&
        fav.nombre === recetaToCheck.nombre &&
        JSON.stringify(fav.ingredientes) === JSON.stringify(recetaToCheck.ingredientes)
      );
    } else {
      return existingFavs.some(fav => fav.id === recetaToCheck.id && fav.IA !== true);
    }
  };

  const loadRecetaData = async () => {
    if (!receta || !receta.id) return;

    try {
      const data = await api.obtenerRecetaPorId(receta.id);

      if (data.data && data.data.length > 0) {
        const recetaActualizada = data.data[0];
        setReceta(recetaActualizada);

        const existingFavs = JSON.parse(localStorage.getItem("recetasFavs")) || [];
        const recetaIndex = existingFavs.findIndex(fav => fav.id === receta.id);

        if (recetaIndex !== -1) {
          existingFavs[recetaIndex] = {
            ...existingFavs[recetaIndex],
            valoracion: recetaActualizada.valoracion
          };
          localStorage.setItem("recetasFavs", JSON.stringify(existingFavs));
        }
      }
    } catch (error) {
      console.error("Error al cargar la receta:", error);
      setSnackbarMessage("Error al cargar los datos de la receta");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const loadReseñas = async () => {
    if (!receta || !receta.id) return;

    setIsLoading(true);
    try {
      const data = await api.obtenerReseniasReceta(receta.id);

      let reseñasData = [];
      if (data.data && data.data.length > 0 && data.data[0].reseñas) {
        reseñasData = data.data[0].reseñas;
        setReseñas(reseñasData);
        await loadRecetaData();
      } else {
        setReseñas([]);
      }
    } catch (error) {
      console.error("Error al cargar las reseñas:", error);
      setReseñas([]);
      setSnackbarMessage("Error cargando reseñas");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      await loadRecetaData();
      setIsLoading(false);
    }
  };

  const handleFavorite = () => {
    const existingFavs = JSON.parse(localStorage.getItem("recetasFavs")) || [];

    let recetaIndex = -1;

    if (isAIGenerated) {
      recetaIndex = existingFavs.findIndex(fav =>
        fav.IA === true &&
        fav.nombre === receta.nombre &&
        JSON.stringify(fav.ingredientes) === JSON.stringify(receta.ingredientes)
      );
    } else {
      recetaIndex = existingFavs.findIndex(fav => fav.id === receta.id && fav.IA !== true);
    }

    if (recetaIndex !== -1) {
      existingFavs.splice(recetaIndex, 1);
      setIsFavorite(false);
      setSnackbarMessage("Receta eliminada de favoritos");
      setSnackbarSeverity("info");
    } else {
      existingFavs.push({ ...receta });
      setIsFavorite(true);
      setSnackbarMessage("Receta añadida a favoritos");
      setSnackbarSeverity("success");
    }

    localStorage.setItem("recetasFavs", JSON.stringify(existingFavs));
    setSnackbarOpen(true);
  };

  useEffect(() => {
    if (receta) {
      const isInFavorites = checkIfFavorite(receta);
      setIsFavorite(isInFavorites);
    }
  }, [receta]);

  useEffect(() => {
    if (receta && receta.id && !isAIGenerated) {
      loadReseñas();
    }
  }, [receta.id, isAIGenerated]);

  useEffect(() => {
    const nuevaReseña = localStorage.getItem("nuevaReseña");
    if (nuevaReseña === "true" && receta && receta.id && !isAIGenerated) {
      localStorage.removeItem("nuevaReseña");
      loadReseñas();
      setSnackbarMessage("Reseña añadida correctamente");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }
  }, [receta, isAIGenerated]);

  const handleDeleteSuccess = (deletedReseñaId) => {
    const reseñasActualizadas = reseñas.filter(r => r.id !== deletedReseñaId);
    setReseñas(reseñasActualizadas);

    setSnackbarMessage("Reseña eliminada correctamente");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);

    loadRecetaData();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      console.log("Eliminar receta", receta.id);
      await api.eliminarReceta(receta.id);
      console.log("Receta eliminada con éxito");
      window.location.href = '/all-recipes';
    } catch (error) {
      console.error("Error al eliminar la receta:", error);
      setSnackbarMessage("Error al eliminar la receta");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (!receta || !receta.id) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 5 }, textAlign: 'center' }}>
        <Spinner />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: { xs: 2, sm: 3, md: 5 },
        px: { xs: 1, sm: 2, md: 3 }
      }}
    >
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            backgroundColor: "#fffefc",
            borderRadius: { xs: "16px", sm: "20px", md: "24px" },
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            mb: { xs: 4, sm: 6, md: 8 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              height: { xs: "200px", sm: "300px", md: "400px" },
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={imagenAMostrar}
              alt={receta.nombre}
              onError={() => {
                if (imageIndex < imageCandidates.length - 1) {
                  setImageIndex(prev => prev + 1);
                  return;
                }
                setImageIndex(imageCandidates.length);
              }}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.8)",
                transition: "transform 0.8s ease",
                "&:hover": {
                  transform: { xs: "none", md: "scale(1.05)" },
                },
              }}
            />

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                p: { xs: 2, sm: 3, md: 4 },
                color: "white",
              }}
            >
              <Grid container alignItems="flex-end" spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12}>
                  <Typography
                    variant="h3"
                    component="h1"
                    fontWeight={800}
                    sx={{
                      fontSize: { xs: "1.5rem", sm: "2rem", md: "2.8rem" },
                      textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                      mb: { xs: 1, sm: 1.5, md: 2 },
                      lineHeight: 1.2,
                    }}
                  >
                    {receta.nombre}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{
                    display: "flex",
                    gap: { xs: 0.5, sm: 1 },
                    flexWrap: "wrap",
                    justifyContent: "flex-start"
                  }}>
                    <StyledChip
                      label={receta.tipoCocina}
                      color="primary"
                      sx={{ backgroundColor: "#1D70B8", color: "white" }}
                    />
                    {getTiposComidaChips(receta.tipoComida).map((tipo, index) => (
                      <StyledChip
                        key={index}
                        label={tipo}
                        sx={{ backgroundColor: "#4caf50", color: "white" }}
                      />
                    ))}
                    {isAIGenerated && (
                      <StyledChip
                        label="IA"
                        sx={{ backgroundColor: "#9c27b0", color: "white" }}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
            {((user?.role === "admin" && !isAIGenerated) || recipeUser) && (
              <Box sx={{ mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    backgroundColor: "#EAF3FB",
                    borderRadius: "12px",
                    border: "1px dashed #ffcc80"
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 2, color: "#f57c00" }}>
                    Panel de administración
                  </Typography>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Link to={`/edit-recipe`} style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        sx={{
                          backgroundColor: "#1D70B8",
                          color: "white",
                          borderRadius: "10px",
                          boxShadow: "0 4px 10px rgba(29, 112, 184, 0.3)",
                          '&:hover': {
                            backgroundColor: "#1D70B8",
                            boxShadow: "0 6px 12px rgba(29, 112, 184, 0.4)"
                          }
                        }}
                      >
                        Editar receta
                      </Button>
                    </Link>

                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      sx={{
                        borderColor: "#d32f2f",
                        color: "#d32f2f",
                        borderRadius: "10px",
                        '&:hover': {
                          backgroundColor: "#EAF3FB",
                          borderColor: "#b71c1c"
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Box>

                  <Collapse in={showDeleteConfirm}>
                    <Box sx={{ mt: 2, p: 2, backgroundColor: "#EAF3FB", borderRadius: "8px" }}>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        ¿Seguro que quieres eliminar esta receta? Esta acción no se puede deshacer.
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                        <Button
                          variant="text"
                          size="small"
                          onClick={cancelDelete}
                          sx={{ color: "#546e7a" }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={confirmDelete}
                          sx={{ backgroundColor: "#d32f2f", color: "white" }}
                        >
                          Confirmar
                        </Button>
                      </Box>
                    </Box>
                  </Collapse>
                </Paper>
              </Box>
            )}

            <Grid container spacing={{ xs: 1, sm: 2, md: 6 }} sx={{ mb: { xs: 3, sm: 4 } }}>
              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <AccessTimeIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Tiempo total
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {receta.tiempoCocinado === 0 ? '< 10' : receta.tiempoCocinado} min
                    </Typography>
                  </Box>
                </RecipeInfoBox>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <DifficultyIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Dificultad
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {receta.dificultad}
                    </Typography>
                  </Box>
                </RecipeInfoBox>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <RestaurantIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Tipo de comida
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {getTipoComidaDisplay(receta.tipoComida)}
                    </Typography>
                  </Box>
                </RecipeInfoBox>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <LocalDiningIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Porciones
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {receta.porciones || '-'}
                    </Typography>
                  </Box>
                </RecipeInfoBox>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <LocalFireDepartmentIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Calorías/porción
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
                    >
                      {receta.caloriasPorPorcion || '-'} kcal
                    </Typography>
                  </Box>
                </RecipeInfoBox>
              </Grid>

              <Grid item xs={6} sm={4} md={2}>
                <RecipeInfoBox>
                  <StarIcon sx={{
                    color: "#1D70B8",
                    mr: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "1.2rem", sm: "1.5rem" }
                  }} />
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" } }}
                    >
                      Valoración
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        sx={{
                          mr: 0.5,
                          fontSize: { xs: "0.8rem", sm: "1rem" }
                        }}
                      >
                        {receta.valoracion ? parseFloat(receta.valoracion).toFixed(1) : '0.0'}
                      </Typography>
                      <Rating
                        value={receta.valoracion ? parseFloat(receta.valoracion) : 0}
                        readOnly
                        precision={0.5}
                        size="small"
                        sx={{
                          fontSize: { xs: "0.9rem", sm: "1.2rem" }
                        }}
                      />
                    </Box>
                  </Box>
                </RecipeInfoBox>
              </Grid>
            </Grid>

            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: { xs: 3, sm: 4 }
            }}>
              <Tooltip title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}>
                <IconButton
                  onClick={handleFavorite}
                  sx={{
                    backgroundColor: "#EAF3FB",
                    size: { xs: "small", sm: "medium" },
                    '&:hover': { backgroundColor: "#D6E9F8" },
                    transform: isFavorite ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s ease-in-out'
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon sx={{
                      color: "#ff4081",
                      fontSize: { xs: "1.2rem", sm: "1.5rem" }
                    }} />
                  ) : (
                    <FavoriteBorderIcon sx={{
                      color: "#1D70B8",
                      fontSize: { xs: "1.2rem", sm: "1.5rem" }
                    }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            <Divider sx={{ my: { xs: 3, sm: 4, md: 5 } }} />

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {receta.descripcion && (
                <Grid item xs={12}>
                  <StyledPaper>
                    <SectionTitle variant="h4">Descripción</SectionTitle>
                    <Typography
                      variant="body1"
                      sx={{
                        lineHeight: 1.7,
                        color: "#424242",
                        fontSize: { xs: "0.9rem", sm: "1rem" }
                      }}
                    >
                      {receta.descripcion}
                    </Typography>
                  </StyledPaper>
                </Grid>
              )}

              <Grid item xs={12} md={6} sx={{ width: "300px" }}>
                <StyledPaper>
                  <SectionTitle variant="h4">Ingredientes</SectionTitle>
                  <List sx={{ p: 0 }}>
                    {receta.ingredientes && receta.ingredientes.map((ingrediente, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: { xs: 0.5, sm: 1 },
                          px: 0,
                          borderBottom: index < receta.ingredientes.length - 1 ? "1px solid #f5f5f5" : "none"
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                color: "#424242"
                              }}
                            >
                              • {ingrediente.nombreIngrediente}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </StyledPaper>
              </Grid>

              <Grid item xs={12} md={6} id="tarjeta-pasos" sx={{ width: "700px" }}>
                <StyledPaper>
                  <SectionTitle variant="h4">Preparación</SectionTitle>
                  <List sx={{ p: 0 }}>
                    {receta.pasos && receta.pasos.map((paso, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          py: { xs: 1, sm: 1.5 },
                          px: 0,
                          borderBottom: index < receta.pasos.length - 1 ? "1px solid #f5f5f5" : "none",
                          alignItems: "flex-start"
                        }}
                      >
                        <Avatar
                          sx={{
                            backgroundColor: "#1D70B8",
                            color: "white",
                            width: { xs: 24, sm: 32 },
                            height: { xs: 24, sm: 32 },
                            fontSize: { xs: "0.8rem", sm: "1rem" },
                            mr: { xs: 1, sm: 2 },
                            mt: 0.5
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{
                                lineHeight: 1.6,
                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                color: "#424242"
                              }}
                            >
                              {paso.nombrePaso}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </StyledPaper>
              </Grid>
            </Grid>

            {!isAIGenerated && (
              <>
                <Divider sx={{ my: { xs: 4, sm: 5, md: 6 } }} />

                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <SectionTitle variant="h4">
                      Reseñas ({reseñas.length})
                    </SectionTitle>

                    <Link
                      to="/create-review"
                      style={{
                        textDecoration: "none",
                        pointerEvents: isUserLoggedIn() ? "auto" : "none"
                      }}
                    >
                      <Button
                        variant="contained"
                        disabled={!isUserLoggedIn()}
                        sx={{
                          backgroundColor: isUserLoggedIn() ? "#1D70B8" : "#e0e0e0",
                          color: isUserLoggedIn() ? "white" : "#9e9e9e",
                          borderRadius: "25px",
                          px: { xs: 2, sm: 3 },
                          py: { xs: 1, sm: 1.5 },
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          boxShadow: isUserLoggedIn() ? "0 4px 12px rgba(29, 112, 184, 0.3)" : "none",
                          cursor: isUserLoggedIn() ? "pointer" : "not-allowed",
                          '&:hover': {
                            backgroundColor: isUserLoggedIn() ? "#1D70B8" : "#e0e0e0",
                            boxShadow: isUserLoggedIn() ? "0 6px 16px rgba(29, 112, 184, 0.4)" : "none"
                          },
                          '&:disabled': {
                            backgroundColor: "#e0e0e0",
                            color: "#9e9e9e"
                          }
                        }}
                      >
                        {isUserLoggedIn() ? "Escribir reseña" : "Inicia sesión para escribir una reseña"}
                      </Button>
                    </Link>
                  </Box>
                </Box>

                {isLoading ? (
                  <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                    <Spinner />
                  </Box>
                ) : reseñas.length > 0 ? (
                  <Grid container spacing={{ xs: 2, sm: 3 }}>
                    {reseñas.map((reseña) => (
                      <Grid item xs={12} key={reseña.id}>
                        <ReseñaCard
                          reseña={reseña}
                          onDeleteSuccess={handleDeleteSuccess}
                        />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <StyledPaper>
                    <Box sx={{ textAlign: 'center', py: { xs: 3, sm: 4 } }}>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                      >
                        Todavía no hay reseñas
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          fontSize: { xs: "0.8rem", sm: "0.875rem" }
                        }}
                      >
                        Sé la primera persona en escribir una reseña para esta receta.
                      </Typography>
                    </Box>
                  </StyledPaper>
                )}
              </>
            )}
          </Box>
        </Box>
      </Fade>

      <Box sx={{
        display: "flex",
        justifyContent: "center",
        mt: { xs: 3, sm: 4 }
      }}>
        <Link to="/all-recipes" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: "#1D70B8",
              color: "#1D70B8",
              borderRadius: "25px",
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              '&:hover': {
                backgroundColor: "#EAF3FB",
                borderColor: "#1D70B8"
              }
            }}
          >
            Volver a recetas
          </Button>
        </Link>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{
            width: '100%',
            fontSize: { xs: "0.8rem", sm: "0.875rem" }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
