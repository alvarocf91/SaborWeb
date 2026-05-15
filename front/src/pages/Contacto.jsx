import { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Snackbar, Alert,
  Paper, Card, CardContent, Grid, InputAdornment, Divider
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import MessageIcon from "@mui/icons-material/Message";
import SendIcon from "@mui/icons-material/Send";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BusinessIcon from "@mui/icons-material/Business";

export default function Contacto() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [mensaje, setMensaje] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const validarFormulario = () => {
    if (!nombre.trim()) {
      setError(true);
      setMensajeError("El nombre es obligatorio");
      return false;
    }

    if (!apellido.trim()) {
      setError(true);
      setMensajeError("El apellido es obligatorio");
      return false;
    }

    if (!email.trim()) {
      setError(true);
      setMensajeError("El correo electrónico es obligatorio");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError(true);
      setMensajeError("Introduce una dirección de correo válida");
      return false;
    }

    if (!mensaje.trim()) {
      setError(true);
      setMensajeError("El mensaje es obligatorio");
      return false;
    }

    if (mensaje.trim().length < 10) {
      setError(true);
      setMensajeError("El mensaje debe tener al menos 10 caracteres");
      return false;
    }

    return true;
  };

  const manejarEnvio = async () => {
    if (!validarFormulario()) {
      return;
    }

    setEnviando(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const datosContacto = {
        nombre,
        apellido,
        email,
        telefono,
        empresa,
        mensaje,
        fechaEnvio: new Date().toISOString()
      };

      console.log("Datos de contacto enviados:", datosContacto);
      
      setOpenSnackbar(true);
      
      setTimeout(() => {
        setNombre("");
        setApellido("");
        setEmail("");
        setTelefono("");
        setEmpresa("");
        setMensaje("");
      }, 1500);
      
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      setError(true);
      setMensajeError("Error al enviar el mensaje. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  const manejarCerrarError = () => {
    setError(false);
  };

  const manejarCambioTelefono = (e) => {
    const valor = e.target.value.replace(/[^0-9+\-\s()]/g, '');
    setTelefono(valor);
  };

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
          <ContactMailIcon sx={{ fontSize: 36, mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Contacto
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
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Nos encantaría saber de ti. Envíanos un mensaje y responderemos lo antes posible.
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Nombre"
              variant="outlined"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#1D70B8' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              required
              label="Apellido"
              variant="outlined"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#1D70B8' }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Teléfono"
              variant="outlined"
              value={telefono}
              onChange={manejarCambioTelefono}
              placeholder="+34 600 000 000"
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#1D70B8' }} />
                  </InputAdornment>
                )
              }}
              helperText="Opcional - Incluye si quieres que te llamemos"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Empresa/Organización"
              variant="outlined"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value)}
              placeholder="Nombre de tu empresa"
              InputProps={{
                sx: { borderRadius: 2 },
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon sx={{ color: '#1D70B8' }} />
                  </InputAdornment>
                )
              }}
              helperText="Opcional"
            />
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
              }}>
                <MessageIcon fontSize="small" />
              </Box>
              Tu Mensaje
            </Typography>

            <TextField
              fullWidth
              required
              label="Mensaje"
              variant="outlined"
              multiline
              rows={6}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Por favor proporciona detalles sobre tu consulta. Cuanta más información compartas, mejor podremos ayudarte."
              InputProps={{
                sx: { borderRadius: 2 }
              }}
              helperText={`${mensaje.length}/1000 characters`}
              inputProps={{ maxLength: 1000 }}
            />

            <Typography variant="body2" sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              color: 'text.secondary',
              mt: 2
            }}>
              <Box component="span" sx={{
                bgcolor: '#e6f0ff',
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
              Normalmente respondemos dentro de 24 horas en días laborables.
            </Typography>
          </CardContent>
        </Card>

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
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
            Atrás
          </Button>

          <Button
            variant="contained"
            onClick={manejarEnvio}
            disabled={enviando}
            startIcon={<SendIcon />}
            sx={{
              borderRadius: 2,
              bgcolor: '#1D70B8',
              '&:hover': {
                bgcolor: '#1D70B8'
              },
              px: 3
            }}
          >
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
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
              <SendIcon fontSize="small" />
            </Box>
            Mensaje enviado con éxito. Te responderemos pronto.
          </Box>
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={4000}
        onClose={manejarCerrarError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={manejarCerrarError}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {mensajeError}
        </Alert>
      </Snackbar>
    </Container>
  );
}