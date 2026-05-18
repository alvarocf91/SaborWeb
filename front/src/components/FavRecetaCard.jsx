import {
    Typography,
    Box,
    Button,
    Card,
    CardMedia,
    CardContent,
    Divider,
    Chip,
    Rating
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SaborwebContext } from "../context/SaborwebProvider";
import { API_BASE_URL } from "../context/ApiProvider";

const imagenRecetaPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect width='600' height='360' fill='%23EAF3FB'/%3E%3Ccircle cx='300' cy='150' r='48' fill='%23D6E9F8'/%3E%3Cpath d='M276 142h48v18h-48zM285 125h30v17h-30zM265 165h70v18h-70z' fill='%231D70B8'/%3E%3Ctext x='300' y='240' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%231D70B8'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export default function FavRecetaCard({ receta, onRemove }) {
    const { setReceta } = useContext(SaborwebContext);
    const rawImage = receta.imagen_url || receta.imagen || receta.imagenUrl || "";
    const publicBase = API_BASE_URL.replace(/\/api\/?$/, '');
    const resolveImageUrl = (value) => {
        if (!value || typeof value !== "string") return imagenRecetaPlaceholder;
        const normalized = value.trim().replace(/^http:\/\//, "https://");
        if (normalized.startsWith("https://")) {
            return normalized.includes("/storage/") && !normalized.includes("/public/storage/")
                ? normalized.replace("/storage/", "/public/storage/")
                : normalized;
        }
        if (normalized.startsWith("/storage/")) return `${publicBase}${normalized}`;
        if (normalized.startsWith("storage/")) return `${publicBase}/${normalized}`;
        if (normalized.startsWith("/recetas/")) return `${publicBase}/storage${normalized}`;
        if (normalized.startsWith("recetas/")) return `${publicBase}/storage/${normalized}`;
        return `${publicBase}/storage/${normalized}`;
    };
    const imageUrl = resolveImageUrl(rawImage);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%' }}
        >
            <Card
                elevation={3}
                sx={{
                    height: '100%',
                    width: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 20px rgba(29, 112, 184, 0.2)',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 10,
                        '&:hover': {
                            opacity: 1,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Link to={`/recipe-detail`} style={{ textDecoration: 'none' }}>
                            <Button
                                variant="contained"
                                startIcon={<VisibilityIcon />}
                                sx={{
                                    backgroundColor: "#1D70B8",
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    fontWeight: 'bold',
                                    textTransform: "none",
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                                    '&:hover': {
                                        backgroundColor: "#1D70B8",
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                                    }
                                }}
                                onClick={setReceta(receta)}
                            >
                                Ver receta
                            </Button>
                        </Link>
                        {
                            <Button
                                variant="contained"
                                startIcon={<DeleteIcon />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(receta.id);
                                }}
                                sx={{
                                    backgroundColor: "white",
                                    color: "#f44336",
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    fontWeight: 'bold',
                                    textTransform: "none",
                                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                                    '&:hover': {
                                        backgroundColor: "#EAF3FB",
                                        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                                    }
                                }}
                            >
                                Quitar
                            </Button>
                        }
                    </Box>
                </Box>

                <CardMedia
                    component="img"
                    height="180"
                    image={imageUrl || imagenRecetaPlaceholder}
                    alt={receta.nombre}
                    onError={(e) => {
                        e.currentTarget.src = imagenRecetaPlaceholder;
                    }}
                />

                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        sx={{
                            color: '#1D70B8',
                            fontWeight: 'bold'
                        }}
                    >
                        {receta.nombre}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <RestaurantIcon sx={{ fontSize: '0.9rem', color: '#1D70B8', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Tipo de cocina: {receta.tipoCocina || 'No especificado'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <CategoryIcon sx={{ fontSize: '0.9rem', color: '#1D70B8', mr: 1, mt: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                                Tipo de comida: {Array.isArray(receta.tipoComida) ? receta.tipoComida.join(", ") : (receta.tipoComida || 'No especificado')}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocalDiningIcon sx={{ fontSize: '0.9rem', color: '#1D70B8', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Porciones: {receta.porciones || 'No especificado'}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Chip
                            icon={<SignalCellularAltIcon />}
                            label={receta.dificultad || 'N/A'}
                            size="small"
                            sx={{
                                bgcolor: '#EAF3FB',
                                color: '#1D70B8',
                                border: '1px solid #e6f0ff',
                            }}
                        />
                        <Chip
                            icon={<AccessTimeIcon />}
                            label={receta.tiempoCocinado ? `${receta.tiempoCocinado} min` : '< 10 min'}
                            size="small"
                            sx={{
                                bgcolor: '#EAF3FB',
                                color: '#1D70B8',
                                border: '1px solid #e6f0ff',
                            }}
                        />
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2,
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <FavoriteIcon sx={{ fontSize: '1rem', color: '#1D70B8', mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Favorita
                            </Typography>
                        </Box>

                        <Rating
                            name={`rating-${receta.id}`}
                            value={receta.valoracion || 0}
                            precision={0.5}
                            readOnly
                            size="small"
                            sx={{
                                '& .MuiRating-iconFilled': {
                                    color: '#1D70B8',
                                }
                            }}
                        />
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5 }}
                        >
                            {receta.valoracion ? `${Number(receta.valoracion).toFixed(1)}/5` : 'Sin valoraciones'}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );
};
