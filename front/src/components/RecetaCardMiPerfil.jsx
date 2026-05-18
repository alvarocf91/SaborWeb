import {
    Typography, Button, Box, Card, Rating, Chip
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

export default function RecetaCardMiPerfil({ receta, handleVerReceta }) {
    return (
        <Card sx={{
            display: 'flex',
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
            }
        }}>
            <Box sx={{
                width: '35%',
                minHeight: 150,
                maxHeight: 150,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {receta.imagen && (
                    <Box
                        component="img"
                        src={receta.imagen}
                        alt={receta.nombre}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                )}
            </Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '65%',
                p: 2
            }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5, color: '#333' }}>
                        {receta.nombre}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                            value={parseFloat(receta.valoracion) || 0}
                            readOnly
                            precision={0.5}
                            size="small"
                            sx={{ color: '#1D70B8' }}
                        />
                        <Typography variant="body2" sx={{ ml: 1, color: '#666' }}>
                            {receta.valoracion || '0'}/5
                        </Typography>
                    </Box>

                    <Chip
                        label={receta.tipoCocina || 'General'}
                        size="small"
                        sx={{
                            bgcolor: '#e6f0ff',
                            color: '#f57c00',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleVerReceta(receta)}
                        sx={{
                            borderRadius: 4,
                            bgcolor: '#1D70B8',
                            fontSize: '0.75rem',
                            '&:hover': {
                                bgcolor: '#1D70B8'
                            },
                            textTransform: 'none'
                        }}
                    >
                        Ver receta
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

