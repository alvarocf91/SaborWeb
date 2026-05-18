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
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useContext, useMemo, useState } from "react";
import { SaborwebContext } from "../context/SaborwebProvider";
import { API_BASE_URL } from "../context/ApiProvider";

const imagenRecetaPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='360' viewBox='0 0 600 360'%3E%3Crect width='600' height='360' fill='%23EAF3FB'/%3E%3Ccircle cx='300' cy='150' r='48' fill='%23D6E9F8'/%3E%3Cpath d='M276 142h48v18h-48zM285 125h30v17h-30zM265 165h70v18h-70z' fill='%231D70B8'/%3E%3Ctext x='300' y='240' text-anchor='middle' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%231D70B8'%3EImagen no disponible%3C/text%3E%3C/svg%3E";

export default function MisRecetasCard({ receta, onRemove, onEdit }) {
    const { setReceta } = useContext(SaborwebContext);
    const [imageIndex, setImageIndex] = useState(0);

    const imageCandidates = useMemo(() => {
        const raw = receta.imagen_url || receta.imagen || receta.imagenUrl || null;
        if (!raw || typeof raw !== 'string') return [];
        const publicBase = API_BASE_URL.replace(/\/api\/?$/, '');
        const origin = API_BASE_URL.split('/public')[0];
        const normalized = raw.trim();
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
        if (normalized.startsWith('http://')) add(normalized.replace('http://', 'https://'));
        if (/^https?:\/\//.test(normalized) && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) add(normalized.replace('/storage/', '/public/storage/'));
        if (normalized.startsWith('https://') && normalized.includes('/storage/') && !normalized.includes('/public/storage/')) add(normalized.replace('/storage/', '/public/storage/'));
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
        if (!normalized.startsWith('http')) {
            add(`${publicBase}/storage/${normalized}`);
            add(`${origin}/${normalized}`);
        }

        return Array.from(candidates);
    }, [receta.imagen, receta.imagen_url, receta.imagenUrl]);

    const imagenAMostrar = imageCandidates[imageIndex] || imagenRecetaPlaceholder;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card-grid-item"
            style={{ width: '100%' }}
        >
            <Card
                elevation={3}
                className="card-smooth card-hoverable"
                sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                <Box className="media-overlay" />

                {imagenAMostrar && (
                    <CardMedia
                        component="img"
                        height="180"
                        image={imagenAMostrar}
                        alt={receta.nombre}
                        sx={{ objectFit: 'cover' }}
                        onError={() => {
                            if (imageIndex < imageCandidates.length - 1) {
                                setImageIndex(prev => prev + 1);
                                return;
                            }
                            setImageIndex(imageCandidates.length);
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

                {/* Action buttons fixed at bottom on hover for larger screens */}
                <Box sx={{ p: 2, display: { xs: 'none', sm: 'flex' }, gap: 1, justifyContent: 'space-between' }}>
                    <Link to={`/recipe-detail`} style={{ textDecoration: 'none', width: '48%' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<VisibilityIcon />}
                            sx={{
                                background: 'linear-gradient(90deg, rgba(29,112,184,1) 0%, rgba(29,112,184,0.95) 100%)',
                                color: '#fff',
                                boxShadow: '0 6px 18px rgba(29,112,184,0.18)',
                                '&:hover': { boxShadow: '0 10px 24px rgba(29,112,184,0.2)' }
                            }}
                            onClick={() => setReceta(receta)}
                        >Ver</Button>
                    </Link>

                    <Box sx={{ width: '48%', display: 'flex', gap: 1 }}>
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            fullWidth
                            onClick={(e) => { e.stopPropagation(); onEdit(receta); }}
                            sx={{ borderColor: 'rgba(29,112,184,0.12)', color: '#1D70B8' }}
                        >Editar</Button>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            fullWidth
                            onClick={(e) => { e.stopPropagation(); onRemove(receta.id); }}
                            sx={{ borderColor: 'rgba(244,67,54,0.12)', color: '#f44336' }}
                        >Eliminar</Button>
                    </Box>
                </Box>

            </Card>
        </motion.div>
    );
};

MisRecetasCard.propTypes = {
    receta: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        nombre: PropTypes.string.isRequired,
        imagen: PropTypes.string,
        tipoCocina: PropTypes.string,
        tipoComida: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string)
        ]),
        porciones: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        dificultad: PropTypes.string,
        tiempoCocinado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        valoracion: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired
};
