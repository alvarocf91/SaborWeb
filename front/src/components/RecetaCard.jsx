import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Box,
    Button,
    Chip,
    Divider,
    Rating
} from "@mui/material";
import { Link } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { motion } from "framer-motion";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { SaborwebContext } from "../context/SaborwebProvider";
import { API_BASE_URL } from '../context/ApiProvider';
import { useLanguage } from "../hooks/useLanguage";

const imagenRecetaPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect width='600' height='360' fill='%23EAF3FB'/%3E%3Ccircle cx='300' cy='150' r='48' fill='%23D6E9F8'/%3E%3Cpath d='M276 142h48v18h-48zM285 125h30v17h-30zM265 165h70v18h-70z' fill='%231D70B8'/%3E%3Ctext x='300' y='240' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%231D70B8'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export default function RecetaCard({ receta }) {
    const { setReceta } = useContext(SaborwebContext);
    const { t } = useLanguage();
    const [imagenFallo, setImagenFallo] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);

    // Determinar qué imagen mostrar (manejar rutas relativas devueltas por el backend)
    const rawImage = receta.imagen_url || receta.imagen || receta.imagenUrl || null;
    const imageCandidates = useMemo(() => {
        if (!rawImage || typeof rawImage !== 'string') return [];
        const publicBase = API_BASE_URL.replace(/\/api\/?$/, '');
        const origin = API_BASE_URL.split('/public')[0];
        const normalized = rawImage.trim();
        const cacheBuster = receta.imagen_cache || receta.imagenCache || null;
        const candidates = new Set();
        const add = (value) => {
            if (value && typeof value === 'string') {
                if (cacheBuster && !value.includes('?')) {
                    candidates.add(`${value}?v=${cacheBuster}`);
                } else {
                    candidates.add(value);
                }
            }
        };

        add(normalized);

        // Upgrade http to https when possible
        if (normalized.startsWith('http://')) {
            add(normalized.replace('http://', 'https://'));
        }
        if (/^https?:\/\//.test(normalized) && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) {
            add(normalized.replace('/storage/', '/public/storage/'));
        }
        if (normalized.startsWith('https://') && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) {
            add(normalized.replace('/storage/', '/public/storage/'));
        }

        // Handle protocol-relative URLs
        if (normalized.startsWith('//')) {
            add(`https:${normalized}`);
        }

        // Normalize public/storage paths
        if (normalized.includes('/public/storage/')) {
            add(normalized.replace('/public/storage/', '/storage/'));
        }

        // Build absolute paths for common relative formats
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
        if (normalized.startsWith('/')) {
            add(`${origin}${normalized}`);
        }
        if (!normalized.startsWith('http')) {
            add(`${publicBase}/storage/${normalized}`);
            add(`${origin}/${normalized}`);
        }

        return Array.from(candidates);
    }, [rawImage]);

    useEffect(() => {
        setImageIndex(0);
        setImagenFallo(false);
    }, [rawImage]);

    useEffect(() => {
        setImagenFallo(false);
    }, [imageIndex]);

    const imagenAMostrar = !imagenFallo && imageCandidates.length > 0 ? imageCandidates[imageIndex] : imagenRecetaPlaceholder;

    const handleImagenError = () => {
        if (imageCandidates.length > 0 && imageIndex < imageCandidates.length - 1) {
            setImageIndex(prev => prev + 1);
            return;
        }
        setImagenFallo(true);
    };

    if (!receta || !receta.id || !receta.nombre) {
        return null;
    }

    return (
        <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
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
                    onClick={() => setReceta(receta)}
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
                        <Link to="/recipe-detail" style={{ textDecoration: 'none' }}>
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
                            >
                                {t('recipes.view')}
                            </Button>
                        </Link>
                    </Box>

                    {imagenAMostrar && (
                        <CardMedia
                            component="img"
                            height="180"
                            image={imagenAMostrar}
                            alt={receta.nombre}
                            onError={handleImagenError}
                            sx={{
                                objectFit: 'cover',
                                backgroundColor: '#f5f5f5'
                            }}
                        />
                    )}

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
                                    {t('recipes.cuisineType')}: {receta.tipoCocina || t('recetaCard.notSpecified')}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                <CategoryIcon sx={{ fontSize: '0.9rem', color: '#1D70B8', mr: 1, mt: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {t('recipes.mealType')}: {Array.isArray(receta.tipoComida) ? receta.tipoComida.join(", ") : receta.tipoComida || t('recetaCard.notSpecified')}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocalDiningIcon sx={{ fontSize: '0.9rem', color: '#1D70B8', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    {t('recetaCard.servings')}: {receta.porciones || t('recetaCard.notSpecified')}
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
        </Grid>
    );
}

RecetaCard.propTypes = {
    receta: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        imagen: PropTypes.string,
        tipoCocina: PropTypes.string,
        tipoComida: PropTypes.arrayOf(PropTypes.string),
        dificultad: PropTypes.string,
        tiempoCocinado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        porciones: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        valoracion: PropTypes.number,
    }).isRequired
};
