import {
  Container, Typography, TextField, Button, Box, IconButton, Snackbar, Alert,
  Paper, Divider, Card, CardContent, Grid, Chip, FormControl, InputLabel, Select,
  MenuItem, OutlinedInput, Checkbox, ListItemText, Autocomplete, InputAdornment
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ImageIcon from "@mui/icons-material/Image";
import TimerIcon from "@mui/icons-material/Timer";
import { useContext } from "react";
import { SaborwebContext } from "../../context/SaborifyProvider";
import { useApi, API_BASE_URL } from "../../context/ApiProvider";
import { useLanguage } from "../../hooks/useLanguage";

export default function EditarReceta() {
  const { receta, setReceta, ingredientes } = useContext(SaborwebContext);
  const api = useApi();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!receta || !receta.id) {
      navigate('/');
    }
  }, [receta, navigate]);

  const [nombre, setNombre] = useState(receta?.nombre || "");
  const [tipoCocina, setTipoCocina] = useState(receta?.tipoCocina || "");
  const [dificultad, setDificultad] = useState(receta?.dificultad || "");
  const [tiempoCocinado, setTiempoCocinado] = useState(receta?.tiempoCocinado?.toString() || "");
  const [tiposComidaDisponibles, setTiposComidaDisponibles] = useState([]);
  const [tiposComidaSeleccionados, setTiposComidaSeleccionados] = useState(receta?.tipoComida || []);
  const [ingredientesUser, setIngredientes] = useState([]);
  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [pasos, setPasos] = useState(receta?.pasos?.map(p => p.nombrePaso || p) || [""]);
  const [imagen, setImagen] = useState(null);
  const buildAbsolute = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    const origin = API_BASE_URL.split('/public')[0];
    if (raw.startsWith('http://')) return raw.replace('http://', 'https://');
    if (raw.startsWith('https://')) return raw;
    if (raw.startsWith('/storage/')) return `${origin}${raw}`;
    if (raw.startsWith('storage/')) return `${origin}/${raw}`;
    if (raw.startsWith('/recetas/')) return `${origin}/storage${raw}`;
    if (raw.startsWith('recetas/')) return `${origin}/storage/${raw}`;
    if (raw.startsWith('/')) return `${origin}${raw}`;
    return `${origin}/${raw}`;
  };

  const [imagenPreview, setImagenPreview] = useState(buildAbsolute(receta?.imagen_url) || buildAbsolute(receta?.imagen) || null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (receta?.ingredientes) {
      const ingredientesFormateados = receta.ingredientes.map(ing => {
        if (ing.id && ing.nombre) {
          return ing;
        }
        else if (ing.nombreIngrediente) {
          const encontrado = ingredientes?.find(i => i.nombre === ing.nombreIngrediente);
          if (encontrado) {
            return encontrado;
          } else {
            return {
              id: `temp-${Date.now()}-${ing.nombreIngrediente}`,
              nombre: ing.nombreIngrediente
            };
          }
        } 
        else if (typeof ing === 'string') {
          const encontrado = ingredientes?.find(i => i.nombre === ing);
          if (encontrado) {
            return encontrado;
          } else {
            return {
              id: `temp-${Date.now()}-${ing}`,
              nombre: ing
            };
          }
        }
        return null;
      }).filter(Boolean);

      setIngredientes(ingredientesFormateados);
    }
  }, [receta, ingredientes]);

  useEffect(() => {
    const cargarTiposComida = async () => {
      setLoading(true);
      try {
        const data = await api.obtenerTiposComida();
        setTiposComidaDisponibles(data);
        } catch (error) {
        console.error("Error:", error);
        setError(true);
      setErrorMessage("No se pudieron cargar los tipos de comida. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    cargarTiposComida();
  }, [api]);

  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError(true);
    setErrorMessage("El nombre de la receta es obligatorio");
      return false;
    }

    if (!tipoCocina.trim()) {
      setError(true);
    setErrorMessage("El tipo de cocina es obligatorio");
      return false;
    }

    if (!dificultad) {
      setError(true);
    setErrorMessage("La dificultad es obligatoria");
      return false;
    }

    if (!tiempoCocinado || isNaN(tiempoCocinado) || tiempoCocinado <= 0) {
      setError(true);
    setErrorMessage("El tiempo de cocinado debe ser un número positivo");
      return false;
    }

    if (tiposComidaSeleccionados.length === 0) {
      setError(true);
    setErrorMessage("Selecciona al menos un tipo de comida");
      return false;
    }

    if (ingredientesUser.length === 0) {
      setError(true);
    setErrorMessage("Añade al menos un ingrediente");
      return false;
    }

    if (pasos.filter(p => p.trim()).length === 0) {
      setError(true);
    setErrorMessage("Añade al menos un paso");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    try {
      let imagenUrl = receta.imagen_url;

      if (imagen) {
        try {
          const imagenData = await api.subirImagen(imagen);
          console.log("Imagen subida", imagenData);
          const extractImageUrl = (obj) => {
            if (!obj) return null;
            const candidates = [
              obj.url,
              obj.path,
              obj.ruta,
              obj.nombre,
              obj.data && obj.data.url,
              obj.data && obj.data.path,
              obj.data && obj.data.ruta,
              obj.data && obj.data.nombre,
            ];

            for (const c of candidates) {
              if (typeof c === 'string' && c.length > 5) return c;
            }

            const queue = [obj];
            while (queue.length) {
              const current = queue.shift();
              if (!current || typeof current !== 'object') continue;
              for (const key of Object.keys(current)) {
                const val = current[key];
                if (typeof val === 'string') {
                  const lower = val.toLowerCase();
                  if (lower.includes('/storage') || lower.startsWith('http') || lower.match(/\.(png|jpe?g|gif|webp)$/)) {
                    return val;
                  }
                } else if (typeof val === 'object') {
                  queue.push(val);
                }
              }
            }
            return null;
          };

          const candidate = extractImageUrl(imagenData);
          if (candidate) {
            imagenUrl = candidate;
            console.log("URL de la imagen", imagenUrl);
          } else {
            throw new Error('Respuesta de imagen invalida');
          }
        } catch (error) {
          console.error("Error al subir imagen:", error);
          setError(true);
        setErrorMessage("Error subiendo la imagen. Intenta de nuevo.");
          setLoading(false);
          return;
        }
      }

      const recetaActualizada = {
        ...receta,
        nombre,
        tipoCocina,
        dificultad,
        tiempoCocinado: parseInt(tiempoCocinado, 10),
        tipoComida: tiposComidaSeleccionados,
        ingredientes: ingredientesUser.map(ingrediente => ({
          id: ingrediente.id,
          nombreIngrediente: ingrediente.nombre
        })),
        pasos: pasos.filter(p => p.trim()).map(paso => ({ nombrePaso: paso })),
        imagen_url: imagenUrl,
      };
      
      const data = await api.actualizarReceta(receta.id, recetaActualizada);
      console.log("Receta actualizada", data);

      setOpenSnackbar(true);

      setTimeout(() => {
        setReceta(data.data);
        navigate(`/recipe-detail`);
      }, 1500);

      console.log("Receta actualizada:", recetaActualizada);
    } catch (error) {
      console.error("Error al guardar la receta:", error);
      setError(true);
    setErrorMessage("Error al guardar los cambios. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngrediente = () => {
    if (!ingredienteSeleccionado) return;

    const yaExiste = ingredientesUser.some(ing =>
      ing.id === ingredienteSeleccionado.id
    );

    if (!yaExiste) {
      setIngredientes([...ingredientesUser, ingredienteSeleccionado]);
    }

    setIngredienteSeleccionado(null);
  };

  const handleRemoveIngrediente = (index) => {
    const nuevos = ingredientesUser.filter((_, i) => i !== index);
    setIngredientes(nuevos);
  };

  const getIngredientesFiltrados = () => {
    return ingredientes?.filter(
      ingrediente => !ingredientesUser.some(ing => ing.id === ingrediente.id)
    ) || [];
  };

  const handleChangePaso = (index, value) => {
    const nuevos = [...pasos];
    nuevos[index] = value;
    setPasos(nuevos);
  };

  const handleAddPaso = () => {
    setPasos([...pasos, ""]);
  };

  const handleRemovePaso = (index) => {
    if (pasos.length <= 1) return;
    const nuevos = pasos.filter((_, i) => i !== index);
    setPasos(nuevos);
  };

  const handleCloseError = () => {
    setError(false);
  };

  const handleChangeTiposComida = (event) => {
    const {
      target: { value },
    } = event;
    setTiposComidaSeleccionados(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleImagenClick = () => {
    fileInputRef.current.click();
  };

  const handleImagenChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedFormats.includes(file.type)) {
        setError(true);
        setErrorMessage('Formato de imagen no valido. Usa PNG, JPG, GIF o WEBP.');
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError(true);
        setErrorMessage('La imagen supera 5MB.');
        return;
      }
      setImagen(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImagen = () => {
    setImagen(null);
    setImagenPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChangeTiempoCocinado = (e) => {
    const valor = e.target.value.replace(/[^0-9]/g, '');
    setTiempoCocinado(valor);
  };

  if (!receta) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={0} sx={{
        p: 0,
        borderRadius: 3,
        overflow: 'hidden',
        background: 'linear-gradient(to right, #1D70B8, #1D70B8)'
      }}>
        <Box sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          color: 'white'
        }}>
          <RestaurantMenuIcon sx={{ fontSize: 36, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
  Edit Recipe
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{
        mt: -2,
        p: 4,
        pt: 5,
        borderRadius: 3,
        position: 'relative',
        zIndex: 1
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Recipe name"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
                label="Nombre de la receta"
              variant="outlined"
  placeholder="E.g.: Italian, Mexican, Homemade..."
              value={tipoCocina}
              onChange={(e) => setTipoCocina(e.target.value)}
              InputProps={{ sx: { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="dificultad-label">Dificultad</InputLabel>
              <Select
                labelId="dificultad-label"
                id="dificultad-select"
                value={dificultad}
                onChange={(e) => setDificultad(e.target.value)}
                label="Dificultad"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="Easy">Fácil</MenuItem>
                <MenuItem value="Medium">Media</MenuItem>
                <MenuItem value="Difficult">Difícil</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
                label="Tiempo de cocinado"
              variant="outlined"
              value={tiempoCocinado}
              onChange={handleChangeTiempoCocinado}
              type="number"
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <TimerIcon sx={{ color: '#1D70B8' }} />
                  </InputAdornment>
                ),
                  endAdornment: <InputAdornment position="end">minutos</InputAdornment>
              }}
              placeholder="45"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="tipos-comida-label">Tipos de comida</InputLabel>
              <Select
                labelId="tipos-comida-label"
                id="tipos-comida-select"
                multiple
                value={tiposComidaSeleccionados}
                onChange={handleChangeTiposComida}
                input={<OutlinedInput label="Tipos de comida" />}
                renderValue={(selected) => {
                  if (selected.length === 0) {
                    return <Box sx={{ height: '20px' }}></Box>;
                  }
                  return (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          size="small"
                          sx={{
                            bgcolor: '#EAF3FB',
                            color: '#1D70B8',
                            borderColor: '#ffccbc'
                          }}
                        />
                      ))}
                    </Box>
                  );
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 224,
                      width: 250,
                    },
                  },
                }}
                sx={{
                  borderRadius: 2,
                  minHeight: '56px',
                  '& .MuiSelect-select': {
                    minHeight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%'
                  }
                }}
                displayEmpty
              >
                {loading ? (
                    <MenuItem disabled>Cargando tipos de comida...</MenuItem>
                ) : (
                  tiposComidaDisponibles.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.nombre}>
                      <Checkbox checked={tiposComidaSeleccionados.indexOf(tipo.nombre) > -1} />
                      <ListItemText primary={tipo.nombre} />
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
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
              Ingredients
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Autocomplete
                fullWidth
                options={getIngredientesFiltrados()}
                value={ingredienteSeleccionado}
                onChange={(event, newValue) => {
                  setIngredienteSeleccionado(newValue);
                }}
                getOptionLabel={(option) => option ? option.nombre : ""}
                renderOption={(props, option) => (
                  <li {...props}>
                    {option.nombre}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                      label="Buscar ingrediente"
                    size="small"
                    placeholder="Escribe para buscar..."
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: 2 }
                    }}
                  />
                )}
                isOptionEqualToValue={(option, value) => option.id === value?.id}
                clearOnBlur={false}
                sx={{ mr: 1 }}
              />
              <Button
                onClick={handleAddIngrediente}
                variant="contained"
                disabled={!ingredienteSeleccionado}
                sx={{
                  borderRadius: 2,
                  bgcolor: '#1D70B8',
                  '&:hover': { bgcolor: '#1D70B8' },
                  '&.Mui-disabled': {
                    bgcolor: '#ffccbc',
                    color: 'rgba(0, 0, 0, 0.26)'
                  }
                }}
              >
                Add
              </Button>
            </Box>

            {ingredientesUser.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
    No hay ingredientes añadidos. Usa la búsqueda para añadir ingredientes.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {ingredientesUser.map((ingrediente, index) => (
                  <Chip
                    key={index}
                    label={ingrediente.nombre}
                    onDelete={() => handleRemoveIngrediente(index)}
                    sx={{
                      bgcolor: '#EAF3FB',
                      color: '#1D70B8',
                      borderColor: '#ffccbc',
                      '& .MuiChip-deleteIcon': {
                        color: '#1D70B8',
                        '&:hover': {
                          color: '#1D70B8'
                        }
                      }
                    }}
                  />
                ))}
              </Box>
            )}

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
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
  Busca y añade ingredientes. Si no encuentras alguno, puedes escribirlo y hacer clic en Añadir.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
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
  Preparation steps
            </Typography>

            {pasos.map((paso, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <Chip
                  label={index + 1}
                  size="small"
                  sx={{
                    mr: 1.5,
                    mt: 1,
                    bgcolor: '#1D70B8',
                    color: 'white',
                    fontWeight: 'bold',
                    minWidth: 32
                  }}
                />
                <TextField
                  fullWidth
                  placeholder={`Describe el paso ${index + 1}`}
                  value={paso}
                  multiline
                  rows={2}
                  onChange={(e) => handleChangePaso(index, e.target.value)}
                  InputProps={{ sx: { borderRadius: 2 } }}
                />
                <IconButton
                  onClick={() => handleRemovePaso(index)}
                  disabled={pasos.length <= 1}
                  sx={{
                    ml: 1,
                    color: pasos.length <= 1 ? '#e0e0e0' : '#f44336',
                    '&:hover': { bgcolor: pasos.length <= 1 ? 'transparent' : 'rgba(244, 67, 54, 0.08)' }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}

            <Button
              onClick={handleAddPaso}
              startIcon={<AddIcon />}
              variant="text"
              sx={{
                mt: 1,
                color: '#1D70B8',
                '&:hover': { bgcolor: 'rgba(29, 112, 184, 0.08)' }
              }}
            >
  Add step
            </Button>
          </CardContent>
        </Card>

        <Card sx={{ mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
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
              }}>3</Box>
  Recipe image
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              border: '1px dashed #ccc',
              p: 3,
              mb: 2
            }}>
              {!imagenPreview ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImagenChange}
                  />
                  <IconButton
                    onClick={handleImagenClick}
                    sx={{
                      mb: 2,
                      p: 2,
                      bgcolor: 'rgba(29, 112, 184, 0.08)',
                      color: '#1D70B8',
                      '&:hover': { bgcolor: 'rgba(29, 112, 184, 0.16)' }
                    }}
                  >
                    <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                  </IconButton>
                  <Typography variant="body1" color="text.secondary" align="center">
  Haz clic para añadir una foto de tu receta
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} align="center">
  Formatos: JPG, PNG (Máx 5 MB)
                  </Typography>
                </>
              ) : (
                <Box sx={{ position: 'relative', width: '100%', textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={imagenPreview}
                    alt="Vista previa de la receta"
                    sx={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      borderRadius: 2,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={handleRemoveImagen}
                      sx={{ borderRadius: 2 }}
                    >
  Eliminar
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ImageIcon />}
                      onClick={handleImagenClick}
                      sx={{
                        borderRadius: 2,
                        borderColor: '#1D70B8',
                        color: '#1D70B8',
                        '&:hover': {
                          borderColor: '#1D70B8',
                          bgcolor: 'rgba(29, 112, 184, 0.08)'
                        }
                      }}
                    >
  Change image
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
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
  An attractive image of your dish will help more people want to try your recipe.
            </Typography>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderRadius: 2,
              borderColor: '#9e9e9e',
              color: '#757575',
              '&:hover': {
                borderColor: '#757575',
                bgcolor: 'rgba(0,0,0,0.04)'
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleGuardar}
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              borderRadius: 2,
              bgcolor: '#1D70B8',
              '&:hover': {
                bgcolor: '#1D70B8'
              },
              px: 3
            }}
          >
  {loading ? 'Saving...' : 'Save changes'}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
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
              <SaveIcon fontSize="small" />
            </Box>
      Recipe edited successfully!
          </Box>
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={handleCloseError}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}