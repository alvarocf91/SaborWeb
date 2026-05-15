import Receta from "./pages/recetas/Receta";
import Recetas from "./pages/recetas/Recetas";
import { SaborwebProvider } from "./context/SaborifyProvider";
import { ApiProvider } from "./context/ApiProvider";
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Header from "./components/Header";
import HomePage from "./pages/perfil/HomePage";
import Ingredientes from "./pages/ingredientes/Ingredientes";
import Ingrediente from "./pages/ingredientes/Ingrediente";
import Footer from "./components/Footer";
import "./css/estilos.css";
import EditarReceta from "./pages/recetas/EditarReceta";
import NuevReceta from "./pages/recetas/NuevaReceta";
import ScrollToTop from "./pages/ScrollToTop";
import CrearReseña from "./pages/reseñas/CrearReseña";
import NotFoundPage from "./components/NotFoundPage";
import FavoritesRecipes from "./pages/recetas/FavoritesRecipes";
import MisRecetas from "./pages/recetas/MisRecetas";
import InicioSesion from "./pages/perfil/InicioSesion";
import Registro from "./pages/perfil/Registro";
import MiPerfil from "./pages/perfil/MiPerfil";
import Contacto from "./pages/Contacto";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { LanguageProvider } from "./context/LanguageProvider";

const appTheme = createTheme({
    palette: {
        primary: {
            main: '#1D70B8',
            contrastText: '#fff'
        },
        background: {
            default: '#f7fbff',
            paper: '#ffffff'
        }
    },
    shape: {
        borderRadius: 12
    },
    typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        h1: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        h2: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        h4: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        h5: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        h6: { fontFamily: "'Manrope', 'Inter', sans-serif", fontWeight: 700 },
        button: {
            fontWeight: 600,
            textTransform: "none",
            letterSpacing: "0.01em",
        },
    },
    components: {
        MuiPaper: {
            defaultProps: { elevation: 0 },
            styleOverrides: {
                root: {
                    backgroundImage: 'none'
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    boxShadow: '0 8px 20px rgba(15, 35, 60, 0.08)',
                    transition: 'transform 0.28s ease, box-shadow 0.28s ease'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none'
                }
            }
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8
                }
            }
        }
    }
});

export default function App() {
    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <LanguageProvider>
                <ApiProvider>
                    <SaborwebProvider>
                        <BrowserRouter>
                            <ScrollToTop />
                            <Header />
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/login" element={<InicioSesion />} />
                                <Route path="/sign-up" element={<Registro />} />
                                <Route path="/all-recipes" element={<Recetas />} />
                                <Route path="/recipe-detail" element={<Receta />} />
                                <Route path="/edit-recipe" element={<EditarReceta />} />
                                <Route path="/create-recipe" element={<NuevReceta />} />
                                <Route path="/all-ingredients" element={<Ingredientes />} />
                                <Route path="/ingredient-detail" element={<Ingrediente />} />
                                <Route path="/create-review" element={<CrearReseña />} />
                                <Route path="/my-profile" element={<MiPerfil />} /> 
                                <Route path="/my-recipes" element={<MisRecetas/>} /> 
                                <Route path="/favorite-recipes" element={<FavoritesRecipes />} />
                                <Route path="/contact" element={<Contacto/>} /> 

                                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
                            <Footer />
                        </BrowserRouter>
                    </SaborwebProvider>
                </ApiProvider>
            </LanguageProvider>
        </ThemeProvider>
    );
}