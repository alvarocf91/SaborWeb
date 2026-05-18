import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Rating,
    Card,
    CardContent,
    Snackbar,
    Alert,
    CircularProgress,
    Paper,
    Divider,
    InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StarIcon from '@mui/icons-material/Star';
import CommentIcon from '@mui/icons-material/Comment';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiProvider';
import { useLanguage } from '../hooks/useLanguage';
import PropTypes from 'prop-types';

export default function ReseñaForm({ recetaId, usuarioId, onReseñaCreated }) {
    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { t } = useLanguage();

    const navigate = useNavigate();

    const { crearResenia } = useApi();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (puntuacion === 0) {
            setError('Añade una valoración');
            return;
        }

        if (!comentario.trim()) {
            setError('Añade un comentario');
            return;
        }

        if (!recetaId || !usuarioId) {
            setError('Faltan datos necesarios para crear la reseña');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const reseñaData = {
                receta_id: recetaId,
                usuario_id: usuarioId,
                puntuacion,
                comentario: comentario.trim()
            };

            const data = await crearResenia(reseñaData);
            console.log("Reseña creada:", data);

            setPuntuacion(0);
            setComentario('');
            setSuccess(true);

            if (onReseñaCreated) {
                onReseñaCreated(data);
            }

            setTimeout(() => {
                navigate(`/recipe-detail`);
            }, 1500);

        } catch (err) {
            console.error('Error al crear la reseña:', err);
            setError(err.message || 'Error al enviar la reseña');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setError(null);
        setSuccess(false);
    };

    const getRatingText = (rating) => {
        if (rating === 0) return 'Selecciona una valoración';
        return t(`reviews.ratingDescriptions.${rating}`) || '';
    };

    return (
        <Paper elevation={0} sx={{
            p: 0,
            borderRadius: 3,
            overflow: 'hidden',
            mb: 4
        }}>
            <Box sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(to right, #1D70B8, #1D70B8)',
                color: 'white'
            }}>
                <StarIcon sx={{ fontSize: 36, mr: 2 }} />
                <Typography variant="h5" fontWeight="bold">
                    {t('reviews.whatDidYouThink')}
                </Typography>
            </Box>

            <Card elevation={3} sx={{
                mt: -2,
                mx: 2,
                mb: 2,
                p: 0,
                borderRadius: 3,
                position: 'relative',
                zIndex: 1,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
            }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Typography variant="h6" component="h2" fontWeight="medium" sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box component="span" sx={{
                                    bgcolor: '#1D70B8',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5,
                                    fontSize: 18
                                }}>1</Box>
                                Tu valoración
                            </Typography>

                            <Rating
                                name="rating"
                                value={puntuacion}
                                onChange={(event, newValue) => {
                                    setPuntuacion(newValue || 0);
                                    if (newValue > 0 && error?.includes('puntuación')) {
                                        setError(null);
                                    }
                                }}
                                size="large"
                                disabled={loading}
                                sx={{
                                    fontSize: '2.5rem',
                                    '& .MuiRating-iconFilled': {
                                        color: '#1D70B8',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: '#1D70B8',
                                    },
                                }}
                            />

                            <Typography variant="body2" sx={{
                                mt: 1,
                                color: puntuacion === 0 ? 'text.secondary' : '#1D70B8',
                                fontStyle: 'italic',
                                fontWeight: puntuacion === 0 ? 'normal' : 'medium'
                            }}>
                                {getRatingText(puntuacion)}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" component="h2" fontWeight="medium" sx={{
                                mb: 2,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Box component="span" sx={{
                                    bgcolor: '#1D70B8',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: 32,
                                    height: 32,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1.5,
                                    fontSize: 18
                                }}>2</Box>
                                Tu comentario
                            </Typography>

                            <TextField
                                label="Comparte tu experiencia"
                                placeholder="¿Qué te pareció esta receta? ¿La adaptaste? ¿Algún consejo para otros cocineros?"
                                multiline
                                rows={4}
                                value={comentario}
                                onChange={(e) => {
                                    setComentario(e.target.value);
                                    if (e.target.value.trim() && error?.includes('comentario')) {
                                        setError(null);
                                    }
                                }}
                                variant="outlined"
                                fullWidth
                                disabled={loading}
                                error={error?.includes('comentario')}
                                InputProps={{
                                    sx: { borderRadius: 2 },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <CommentIcon sx={{ color: '#1D70B8' }} />
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <Typography variant="body2" sx={{
                                mt: 2,
                                display: 'flex',
                                alignItems: 'center',
                                color: 'text.secondary'
                            }}>
                                <Box component="span" sx={{
                                    bgcolor: '#D6E9F8',
                                    color: '#1D70B8',
                                    borderRadius: '50%',
                                    width: 20,
                                    height: 20,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 1,
                                    fontSize: 14,
                                    fontWeight: 'bold'
                                }}>i</Box>
                                Tu opinión es valiosa para la comunidad. Sé constructivo y aporta detalles.
                            </Typography>
                        </Box>

                        <Box display="flex" justifyContent="center" mt={4}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading || puntuacion === 0}
                                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: '#1D70B8',
                                    '&:hover': {
                                        bgcolor: '#1D70B8'
                                    },
                                    '&:disabled': {
                                        bgcolor: '#bdbdbd'
                                    },
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem'
                                }}
                            >
                                {loading ? 'Enviando...' : 'Publicar reseña'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </Card>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar
                open={success}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseAlert}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%', borderRadius: 2 }}
                    icon={false}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.2)',
                            p: 0.5,
                            borderRadius: '50%',
                            mr: 1,
                            display: 'flex'
                        }}>
                            <StarIcon fontSize="small" />
                        </Box>
                        ¡Reseña publicada correctamente!
                    </Box>
                </Alert>
            </Snackbar>
        </Paper>
    );
}

ReseñaForm.propTypes = {
    recetaId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    usuarioId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onReseñaCreated: PropTypes.func
};
