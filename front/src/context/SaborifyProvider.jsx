import { createContext, useEffect, useState } from "react";
import { useApi } from "./ApiProvider";
export const SaborwebContext = createContext();

export const SaborwebProvider = ({ children }) => {
  const {
    obtenerRecetas,
    obtenerIngredientes,
    obtenerIngredientesAlergenos,
    obtenerAlergenos,
    obtenerRecetasMejorValoradas,
    obtenerDificultades
  } = useApi();

  const [recetas, setRecetas] = useState([]);
  const [receta, setReceta] = useState({});
  const [loading, setLoading] = useState(true);
  const [ingredientes, setIngredientes] = useState([]);
  const [ingrediente, setIngrediente] = useState({});
  const [ingredientesAlergenos, setIngredientesAlergenos] = useState([]);
  const [alergenos, setAlergenos] = useState([]);
  const [recetasMejorValoradas, setRecetasMejorValoradas] = useState([]);
  const [recetasMasVistas, setRecetasMasVistas] = useState([]);
  const [alergenoSeleccionado, setAlergenoSeleccionado] = useState({});
  const [dificultades, setDificultades] = useState([]);

  async function cargaRecetas() {
    try {
      const jsonData = await obtenerRecetas();
      setRecetas(jsonData.data);
    } catch (error) {
      console.error('Error al cargar recetas:', error.message);
    }
  }

  async function cargaIngredientes() {
    try {
      const jsonData = await obtenerIngredientes();
      setIngredientes(jsonData.data);
    } catch (error) {
      console.error('Error al cargar ingredientes:', error.message);
    }
  }

  async function cargaIngredientesAlergenos() {
    try {
      const jsonData = await obtenerIngredientesAlergenos();
      setIngredientesAlergenos(jsonData);
    } catch (error) {
      console.error('Error al cargar ingredientes alérgenos:', error.message);
    }
  }

  async function cargaAlergenos() {
    try {
      const jsonData = await obtenerAlergenos();
      setAlergenos(jsonData);
    } catch (error) {
      console.error('Error al cargar alérgenos:', error.message);
    }
  }

  async function cargaRecetasMejorValoradas() {
    try {
      const jsonData = await obtenerRecetasMejorValoradas();
      setRecetasMejorValoradas(jsonData.data);
    } catch (error) {
      console.error('Error al cargar recetas mejor valoradas:', error.message);
    }
  }

  function cargaRecetasMasVistas() {
    if (recetas.length > 0) {
      const recetasAleatorias = [...recetas]
        .sort(() => Math.random() - 0.5) 
        .slice(0, 9);
      setRecetasMasVistas(recetasAleatorias);
    }
  }

  async function cargaDificultades() {
    try {
      const jsonData = await obtenerDificultades();
      setDificultades(jsonData);
    } catch (error) {
      console.error('Error al cargar dificultades:', error.message);
    }
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        await Promise.all([
          cargaRecetas(),
          cargaIngredientes(),
          cargaAlergenos(),
          cargaIngredientesAlergenos(),
          cargaRecetasMejorValoradas(),
          cargaDificultades()
        ]);
      } catch (e) {
        console.error('Error inicializando datos:', e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (recetas.length > 0) {
      cargaRecetasMasVistas();
    }
  }, [recetas]);

  return (
    <SaborwebContext.Provider
      value={{
        recetas,
        setRecetas,
        receta,
        setReceta,
        ingredientes,
        ingrediente,
        setIngrediente,
        ingredientesAlergenos,
        alergenos,
        recetasMejorValoradas,
        recetasMasVistas, 
        alergenoSeleccionado,
        setAlergenoSeleccionado,
        cargaRecetas,
        dificultades
      }}
    >
      {children}
    </SaborwebContext.Provider>
  );
};