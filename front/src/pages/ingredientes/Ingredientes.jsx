import React, { useContext, useState, useMemo } from "react";
import { SaborwebContext } from "../../context/SaborifyProvider";
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
    <Container maxWidth="lg" sx={{ mt: { xs: 4, sm: 6 }, mb: { xs: 6, sm: 8 }, px: { xs: 2, sm: 3 } }}>
      <Box mb={{ xs: 4, sm: 6 }} textAlign="center">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
            sx={{
            color: '#0077ff',
            fontWeight: 'bold',
            position: 'relative',
            display: 'inline-block',
            fontSize: { xs: '1.8rem', sm: '2.125rem' },
            '&::after': {
              content: '""',
              position: 'absolute',
              width: '60%',
              height: '4px',
              bottom: '-10px',
              left: '20%',
              backgroundColor: '#0077ff',
              borderRadius: '2px'
            }
          }}
        >
          Ingredients & Allergens
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            maxWidth: '700px',
            mx: 'auto',
            mt: 3,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            px: { xs: 1, sm: 0 }
          }}
        >
          Explore our selection of ingredients organized by allergens. Select any category to see more details.
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
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
              elevation={3}
              sx={{
                height: "100%",
                width: { xs: '100%', sm: '350px' },
                maxWidth: '350px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: { xs: 'none', sm: 'translateY(-8px)' },
                  boxShadow: '0 12px 20px rgba(0, 119, 255, 0.2)',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#0077ff',
                  py: { xs: 1.2, sm: 1.5 },
                  px: 2,
                  borderBottom: '4px solid #005fcc'
                }}
              >
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', sm: '1.25rem' }
                  }}
                >
                  {ingredienteAlergeno.alergeno}
                </Typography>
              </Box>

              <CardContent sx={{ flexGrow: 1, pt: { xs: 2, sm: 3 }, px: { xs: 2, sm: 2 } }}>
                <Box
                  component="ul"
                  sx={{
                    listStyle: 'none',
                    pl: 0,
                    mt: 1,
                    mb: 2
                  }}
                >
                  {ingredienteAlergeno.ingredientes.slice(0, 4).map((ingrediente) => (
                    <Box
                      component="li"
                      key={ingrediente.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: { xs: 1.2, sm: 1.5 },
                        pl: 1
                      }}
                    >
                      <RestaurantIcon sx={{ fontSize: '0.9rem', color: '#0077ff', mr: 1 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: { xs: '0.85rem', sm: '0.875rem' }
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
                      And {ingredienteAlergeno.ingredientes.length - 4} more...
                    </Typography>
                  )}
                </Box>
              </CardContent>

              <Box
                display="flex"
                justifyContent="center"
                p={{ xs: 1.5, sm: 2 }}
                sx={{ backgroundColor: '#f0f8ff' }}
              >
                <Button
                  variant="contained"
                  onClick={() => handleSelectAlergeno(ingredienteAlergeno)}
                  startIcon={<SearchIcon />}
                    sx={{
                    backgroundColor: "#0077ff",
                    borderRadius: 2,
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 0.8, sm: 1 },
                    fontWeight: 'bold',
                    textTransform: "none",
                    fontSize: { xs: '0.85rem', sm: '0.875rem' },
                    boxShadow: '0 4px 10px rgba(0, 119, 255, 0.3)',
                    '&:hover': {
                      backgroundColor: "#005fcc",
                      boxShadow: '0 6px 12px rgba(0, 119, 255, 0.4)',
                    }
                  }}
                >
                  View ingredients
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
            borderRadius: { xs: 0, sm: 2 },
            overflow: 'hidden',
            m: { xs: 0, sm: 2 },
            maxHeight: { xs: '100vh', sm: '90vh' }
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#0077ff",
            color: "white",
            fontWeight: 'bold',
            py: { xs: 2, sm: 2.5 },
            px: { xs: 2, sm: 3 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
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
            <ErrorOutlineIcon sx={{ mr: { xs: 1, sm: 1.5 }, flexShrink: 0 }} />
            <Typography
              variant="h6"
              sx={{
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
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
              flexShrink: 0
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 3 },
            backgroundColor: "#f0f8ff",
            overflow: 'auto'
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search ingredient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: {
                mt: { xs: 2, sm: 3 },
                borderRadius: 2,
                backgroundColor: '#fff',
              }
            }}
            sx={{ mb: { xs: 2, sm: 3 } }}
          />

          <Typography
            variant="body2"
            sx={{
              mb: 2,
              color: "text.secondary",
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '0.85rem', sm: '0.875rem' }
            }}
          >
            Click on an ingredient to see its associated recipes.
          </Typography>

          <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

          <Typography
            variant="h6"
            sx={{
                color: "#0077ff",
              fontWeight: 'bold',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1.1rem', sm: '1.25rem' }
            }}
          >
            <RestaurantIcon sx={{ mr: 1 }} />
            Ingredients:
          </Typography>

          {filteredIngredientes?.length > 0 ? (
            <Grid container spacing={{ xs: 1, sm: 1.5 }}>
              {filteredIngredientes.map((ingrediente) => (
                <Grid item xs={12} sm={6} md={4} key={ingrediente.id}>
                  <Link
                    to="/ingredient-detail"
                    style={{ textDecoration: "none" }}
                    onClick={() => handleIngredientSelect(ingrediente)}
                  >
                    <Chip
                      avatar={<Avatar sx={{ bgcolor: '#0077ff' }}>{ingrediente.nombre.charAt(0).toUpperCase()}</Avatar>}
                      label={ingrediente.nombre}
                      clickable
                      sx={{
                        width: '100%',
                        justifyContent: 'flex-start',
                        py: { xs: 2, sm: 2.5 },
                        backgroundColor: '#fff',
                        border: '1px solid #e6f0ff',
                        '&:hover': {
                          backgroundColor: '#e6f7ff',
                        },
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        '& .MuiChip-label': {
                          fontSize: { xs: '0.85rem', sm: '0.9rem' },
                          fontWeight: 500,
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
                py: { xs: 3, sm: 4 },
                backgroundColor: 'rgba(255,255,255,0.5)',
                borderRadius: 2
              }}
            >
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                No ingredients found for this search.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: 'flex-end',
            backgroundColor: "#f0f8ff",
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 }
          }}
        >
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#0077ff",
              borderColor: "#0077ff",
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: 2,
              fontSize: { xs: '0.85rem', sm: '0.875rem' },
              px: { xs: 2, sm: 2.5 },
              '&:hover': {
                borderColor: "#005fcc",
                backgroundColor: 'rgba(0, 119, 255, 0.04)'
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