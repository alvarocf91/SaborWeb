import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export default function NotFoundPage() {
    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '70vh',
                    textAlign: 'center',
                    py: 8
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: { xs: '5rem', md: '8rem' },
                        fontWeight: 800,
                        color: '#1D70B8',
                        mb: 2,
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    404
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 600,
                        mb: 3,
                        color: '#444'
                    }}
                >
                    ¡Página no encontrada!
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        fontSize: '1.1rem',
                        color: '#666',
                        maxWidth: '500px',
                        mb: 5
                    }}
                >
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                    Puede que hayas escrito mal la dirección o que la página haya sido eliminada.
                </Typography>

                <Box
                    sx={{
                        position: 'relative',
                        width: { xs: '280px', sm: '350px' },
                        height: { xs: '200px', sm: '250px' },
                        mb: 4,
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '10%',
                            width: '80%',
                            height: '40px',
                            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 80%)',
                            borderRadius: '50%',
                            zIndex: -1
                        }
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            fontSize: '140px',
                            color: '#1D70B8',
                            opacity: 0.8
                        }}
                    >
                        👨‍🍳
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Button
                        component={Link}
                        to="/"
                        variant="contained"
                        startIcon={<HomeIcon />}
                        sx={{
                            background: 'linear-gradient(45deg, #1D70B8 30%, #1D70B8 90%)',
                            color: 'white',
                            fontWeight: 600,
                            py: 1.2,
                            px: 3,
                            borderRadius: '30px',
                            textTransform: 'none',
                            boxShadow: '0 3px 12px rgba(29, 112, 184, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1D70B8 30%, #1D70B8 90%)',
                                boxShadow: '0 5px 15px rgba(29, 112, 184, 0.4)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Volver al inicio
                    </Button>

                    <Button
                        component={Link}
                        to="/all-recipes"
                        variant="outlined"
                        sx={{
                            color: '#1D70B8',
                            borderColor: '#1D70B8',
                            fontWeight: 600,
                            py: 1.2,
                            px: 3,
                            borderRadius: '30px',
                            textTransform: 'none',
                            '&:hover': {
                                borderColor: '#1D70B8',
                                backgroundColor: 'rgba(29, 112, 184, 0.04)'
                            }
                        }}
                    >
                        Explorar recetas
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}


