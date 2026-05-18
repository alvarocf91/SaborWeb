import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Paper,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import { useApi } from "../../context/ApiProvider";

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const StyledCard = styled(Card)(() => ({
  width: "100%",
  position: "relative",
  overflow: "visible",
  borderRadius: "16px",
  boxShadow: "0 12px 24px rgba(0, 0, 0, 0.08)",
  background: "linear-gradient(140deg, #ffffff 0%, #EAF3FB 100%)",
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    transition: "all 0.3s ease",
    "& fieldset": {
      borderColor: "rgba(29, 112, 184, 0.2)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(29, 112, 184, 0.4)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1D70B8",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(0, 0, 0, 0.6)",
    "&.Mui-focused": {
      color: "#1D70B8",
    },
  },
}));

const StyledButton = styled(Button)(() => ({
  textTransform: "none",
  fontWeight: "600",
  fontSize: "1.05rem",
  padding: "12px 0",
  borderRadius: "12px",
  boxShadow: "0 6px 12px rgba(29, 112, 184, 0.2)",
  background: "linear-gradient(135deg, #1D70B8, #1D70B8)",
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: "0 8px 16px rgba(29, 112, 184, 0.3)",
    background: "linear-gradient(135deg, #1D70B8, #1D70B8)",
    transform: "translateY(-2px)",
  },
}));

const DecorativeShape = styled(Paper)(() => ({
  position: "absolute",
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(29, 112, 184, 0.12), rgba(29, 112, 184, 0.04))",
  zIndex: 0,
}));

export default function InicioSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { iniciarSesion } = useApi();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await iniciarSesion({
        email,
        password,
      });

      localStorage.setItem("token", data.token.split("|")[1]);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/";
    } catch (error) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        py: 4,
        position: "relative",
      }}
    >
      <DecorativeShape sx={{ top: "10%", right: "-50px" }} elevation={0} />
      <DecorativeShape sx={{ bottom: "15%", left: "-30px" }} elevation={0} />

      <StyledCard>
        <Box
          sx={{
            height: "8px",
            width: "100%",
            background: "linear-gradient(90deg, #1D70B8, #1D70B8)",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          }}
        />

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#1D70B8",
                mb: 1.5,
                letterSpacing: "-0.5px",
              }}
            >
              Bienvenido de nuevo
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: "85%", mx: "auto" }}
            >
              Inicia sesión para descubrir nuevas recetas y sabores
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
            <StyledTextField
              fullWidth
              label="Correo electrónico"
              variant="outlined"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutlineIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              label="Contraseña"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="mostrar u ocultar contraseña"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ?
                        <VisibilityOffOutlinedIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} /> :
                        <VisibilityOutlinedIcon sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                      }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <StyledButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Iniciar sesión"}
            </StyledButton>

            <Divider sx={{ my: 3 }} />
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3.5 }}>
            ¿No tienes una cuenta?{" "}
            <Link
              to="/sign-up"
              style={{
                color: "#1D70B8",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Regístrate aquí
            </Link>
          </Typography>
        </CardContent>
      </StyledCard>
    </Container>
  );
}
