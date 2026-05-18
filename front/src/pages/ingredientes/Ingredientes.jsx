import React, { useContext, useState, useMemo } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { SaborwebContext } from "../../context/SaborwebProvider";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slide,
  IconButton,
  Chip,
  Avatar,
  Divider,
  InputAdornment
} from "@mui/material";
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Ingredientes() {
  const { ingredientesAlergenos, setIngrediente, setAlergenoSeleccionado } = useContext(SaborwebContext);
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [selectedAlergeno, setSelectedAlergeno] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpen = (alergeno) => {
    setSelectedAlergeno(alergeno);
    setSearchTerm("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAlergeno(null);
    setSearchTerm("");
  };

  const handleIngredientSelect = (ingrediente) => {
    setIngrediente(ingrediente);
  };

  const filteredIngredientes = useMemo(() => {
    if (!selectedAlergeno) return [];

    return selectedAlergeno.ingredientes.filter((ingrediente) =>
      ingrediente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedAlergeno, searchTerm]);

  const handleSelectAlergeno = (alergeno) => {
    handleOpen(alergeno);
    const alergenoName = alergeno.alergeno.includes(" ")
      ? alergeno.alergeno.split(" ").slice(1).join(" ")
      : alergeno.alergeno;

    setAlergenoSeleccionado(alergenoName);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, px: { xs: 2, sm: 3 } }}>
      {/* Hero Section */}
      <Box 
        mb={{ xs: 6, sm: 8, md: 10 }}
        sx={{
          textAlign: "center",
          position: "relative",
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 5, sm: 6, md: 7 },
          borderRadius: { xs: 4, sm: 6 },
          background: "linear-gradient(135deg, #ffffff 0%, #f9fcff 50%, #f0f8ff 100%)",
          border: "1px solid rgba(29, 112, 184, 0.08)",
          boxShadow: "0 4px 20px rgba(29, 112, 184, 0.06), inset 0 1px 0 rgba(255,255,255,0.5)",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(29, 112, 184, 0.05) 0%, transparent 70%)",
            borderRadius: "50%",
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
              fontSize: { xs: '2rem', sm: '2.5rem', md: '2.85rem' },
              mb: { xs: 2, sm: 2.5, md: 3 },
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                width: '80px',
                height: '5px',
                bottom: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(90deg, #1D70B8, #00a0ff)',
                borderRadius: '3px'
              }
            }}
          >
            {t('ingredientsPage.title')}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: '800px',
              mx: 'auto',
              mt: 4,
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
              lineHeight: 1.7,
              px: { xs: 1, sm: 0 }
            }}
          >
            {t('ingredientsPage.subtitle')}
          </Typography>
        </Box>
      </Box>

      {/* Allergen Cards Grid */}
      <Grid container spacing={{ xs: 2.5, sm: 3, md: 3.5 }} justifyContent="center">
        {ingredientesAlergenos.map((ingredienteAlergeno, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <Card
              elevation={0}
              sx={{
                height: "100%",
                width: { xs: '100%', sm: '380px' },
                maxWidth: '380px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 4,
                overflow: 'hidden',
                border: '1px solid rgba(29, 112, 184, 0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.320, 1)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #1D70B8, #00a0ff)',
                  opacity: 0,
                  transition: 'opacity 0.4s ease',
                },
                '&:hover': {
                  transform: 'translateY(-12px)',
                  boxShadow: '0 20px 40px rgba(29, 112, 184, 0.15), 0 0 60px rgba(29, 112, 184, 0.08)',
                  border: '1px solid rgba(29, 112, 184, 0.15)',
                  '&::before': {
                    opacity: 1,
                  }
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'linear-gradient(135deg, #1D70B8 0%, #0059b3 100%)',
                  background: 'linear-gradient(135deg, #1D70B8 0%, #0059b3 100%)',
                  py: { xs: 2, sm: 2.2 },
                  px: 2.5,
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: 'white',
                    fontWeight: 800,
                    fontSize: { xs: '1.15rem', sm: '1.3rem' },
                    letterSpacing: '-0.3px'
                  }}
                >
                  {ingredienteAlergeno.alergeno}
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1, pt: { xs: 2.5, sm: 3 }, px: { xs: 2.5, sm: 2.5 } }}>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    pl: 0,
                    mt: 1,
                    mb: 2
                  }}
                >
                  {ingredienteAlergeno.ingredientes.slice(0, 4).map((ingrediente, idx) => (
                    <Box
                      component="li"
                      key={ingrediente.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: { xs: 1.3, sm: 1.6 },
                        pl: 0,
                        opacity: idx === 0 ? 1 : idx === 1 ? 0.95 : 0.9,
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <RestaurantIcon sx={{ fontSize: '1rem', color: '#1D70B8', mr: 1.5, flexShrink: 0 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#333',
                          fontWeight: 500,
                          fontSize: { xs: '0.9rem', sm: '0.95rem' },
                          letterSpacing: '-0.2px'
                        }}
                      >
                        {ingrediente.nombre}
                      </Typography>
                    </Box>
                  ))}

                  {ingredienteAlergeno.ingredientes.length > 4 && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                      sx={{
                        mt: 2,
                        fontStyle: 'italic',
                        fontSize: { xs: '0.8rem', sm: '0.875rem' }
                      }}
                    >
                      +{ingredienteAlergeno.ingredientes.length - 4} more
                    </Typography>
                  )}
                </Box>
              </CardContent>

              <Box
                display="flex"
                justifyContent="center"
                p={{ xs: 2, sm: 2.2 }}
                sx={{ 
                  backgroundColor: '#f9fcff',
                  borderTop: '1px solid rgba(29, 112, 184, 0.08)'
                }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleSelectAlergeno(ingredienteAlergeno)}
                  startIcon={<SearchIcon />}
                  sx={{
                    backgroundColor: "#1D70B8",
                    borderRadius: 2.5,
                    px: { xs: 3, sm: 3.5 },
                    py: { xs: 0.9, sm: 1 },
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: { xs: '0.88rem', sm: '0.9rem' },
                    boxShadow: '0 4px 12px rgba(29, 112, 184, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: "#0059b3",
                      boxShadow: '0 8px 20px rgba(29, 112, 184, 0.4)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  {t('ingredientsPage.viewIngredients')}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        TransitionComponent={Transition}
        fullScreen={{ xs: true, sm: false }}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 3 },
            overflow: 'hidden',
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' },
            boxShadow: '0 20px 60px rgba(29, 112, 184, 0.25)',
            border: '1px solid rgba(29, 112, 184, 0.1)'
          }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(135deg, #1D70B8 0%, #0059b3 100%)',
            color: "white",
            fontWeight: 800,
            py: { xs: 2.5, sm: 3 },
            px: { xs: 2.5, sm: 3.5 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: { xs: '1.15rem', sm: '1.35rem' },
            letterSpacing: '-0.3px'
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              minWidth: 0,
              flex: 1,
              mr: 1
            }}
          >
            <ErrorOutlineIcon sx={{ mr: { xs: 1.5, sm: 2 }, flexShrink: 0, fontSize: '1.4rem' }} />
            <Typography
              variant="h6"
              sx={{
                fontSize: 'inherit',
                fontWeight: 'inherit',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {selectedAlergeno?.alergeno}
            </Typography>
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="cerrar"
            sx={{
              flexShrink: 0,
              ml: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'rotate(90deg)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            py: { xs: 2.5, sm: 3.5 },
            px: { xs: 2.5, sm: 3.5 },
            backgroundColor: "#f9fcff",
            overflow: 'auto'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('ingredientsPage.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1D70B8', fontSize: '1.2rem' }} />
                </InputAdornment>
              ),
              sx: {
                mt: { xs: 2.5, sm: 3 },
                borderRadius: 2.5,
                backgroundColor: '#fff',
                border: '1.5px solid rgba(29, 112, 184, 0.3)',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#1D70B8',
                  backgroundColor: '#f0f8ff',
                },
                '&.Mui-focused': {
                  borderColor: '#1D70B8',
                  boxShadow: '0 0 0 3px rgba(29, 112, 184, 0.1)'
                }
              }
            }}
            sx={{ mb: { xs: 2.5, sm: 3.5 } }}
          />

          <Typography
            variant="body2"
            sx={{
              mb: 2.5,
              color: "#666",
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              fontWeight: 500
            }}
          >
            <RestaurantIcon sx={{ mr: 1, color: '#1D70B8' }} />
            {t('ingredientsPage.ingredientsList', { count: filteredIngredientes.length })}
          </Typography>

          {filteredIngredientes?.length > 0 ? (
            <Grid container spacing={{ xs: 1.5, sm: 2 }}>
              {filteredIngredientes.map((ingrediente) => (
                <Grid item xs={12} sm={6} md={4} key={ingrediente.id}>
                  <Link
                    to="/ingredient-detail"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleIngredientSelect(ingrediente)}
                  >
                    <Chip
                      avatar={<Avatar sx={{ bgcolor: '#1D70B8', fontWeight: 700 }}>{ingrediente.nombre.charAt(0).toUpperCase()}</Avatar>}
                      label={ingrediente.nombre}
                      clickable
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        py: { xs: 2.5, sm: 3 },
                        backgroundColor: '#fff',
                        border: '1.5px solid rgba(29, 112, 184, 0.12)',
                        fontWeight: 600,
                        transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        '&:hover': {
                          backgroundColor: '#f0f8ff',
                          borderColor: '#1D70B8',
                          boxShadow: '0 4px 16px rgba(29, 112, 184, 0.15)',
                          transform: 'translateY(-2px)'
                        },
                        '& .MuiChip-label': {
                          fontSize: { xs: '0.88rem', sm: '0.95rem' },
                          fontWeight: 600,
                          letterSpacing: '-0.2px'
                        }
                      }}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: { xs: 4, sm: 5 },
                backgroundColor: '#fff',
                borderRadius: 3,
                border: '2px dashed rgba(29, 112, 184, 0.2)'
              }}
            >
              <SearchIcon sx={{ fontSize: '2.5rem', color: '#ccc', mb: 1 }} />
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.95rem', sm: '1rem' },
                  fontWeight: 500
                }}
              >
                {t('ingredientsPage.noIngredientsFound')}
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            backgroundColor: "#f0f8ff",
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2.5, sm: 3.5 },
            borderTop: '1px solid rgba(29, 112, 184, 0.1)'
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#1D70B8",
              borderColor: "#1D70B8",
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2.5,
              fontSize: { xs: '0.9rem', sm: '0.95rem' },
              px: { xs: 2.5, sm: 3 },
              py: { xs: 0.8, sm: 0.9 },
              border: '1.5px solid #1D70B8',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: "#0059b3",
                color: "#0059b3",
                backgroundColor: 'rgba(29, 112, 184, 0.04)',
                boxShadow: '0 4px 12px rgba(29, 112, 184, 0.15)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}