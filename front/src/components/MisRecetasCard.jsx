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
import { useContext } from "react";
import { SaborwebContext } from "../context/SaborifyProvider";
import imagenPlaceholder from '../assets/imagenRecetaPlaceholder.png';

export default function MisRecetasCard({ receta, onRemove, onEdit }) {
    const { setReceta } = useContext(SaborwebContext);

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

                <CardMedia
                    component="img"
                    height="180"
                    image={receta.imagen || imagenPlaceholder}
                    alt={receta.nombre}
                    sx={{ objectFit: 'cover' }}
                    onError={(e) => {
                        e.currentTarget.src = imagenPlaceholder;
                        e.currentTarget.alt = "Imagen no disponible";
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