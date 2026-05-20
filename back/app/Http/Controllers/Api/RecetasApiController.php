<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CrearRecetaRequest;
use App\Http\Resources\RecetaCollection;
use App\Http\Resources\RecetaResource;
use App\Models\Ingrediente;
use App\Models\Receta;
use App\Models\TipoComida;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RecetasApiController extends Controller
{
    /**
     * Obtener URL base de la aplicación compatible con frontend
     */
    private function getStorageBaseUrl()
    {
        $request = request();
        $basePath = str_replace('/index.php', '', $request->getBaseUrl());

        return rtrim($request->getSchemeAndHttpHost() . $basePath, '/');
    }

    /**
     * Generar URL completa y funcional de la imagen
     */
    private function generateImageUrl($rutaImagen)
    {
        if (!$rutaImagen) return null;

        if (preg_match('/^https?:\/\//', $rutaImagen)) {
            if (str_contains($rutaImagen, 'localhost') || str_contains($rutaImagen, '127.0.0.1')) {
                $path = $this->extractPathFromUrl($rutaImagen);
                return $path ? $this->getStorageBaseUrl() . '/storage/' . ltrim($path, '/') : $rutaImagen;
            }

            return $rutaImagen;
        }

        $path = preg_replace('#^/?(?:public/)?storage/#', '', $rutaImagen);
        return $this->getStorageBaseUrl() . '/storage/' . ltrim($path, '/');
    }

    /**
     * Extraer nombre de archivo de una URL para borrado
     */
    private function extractPathFromUrl($imageUrl)
    {
        if (!$imageUrl) return null;

        $path = parse_url($imageUrl, PHP_URL_PATH) ?: $imageUrl;

        // Extraer solo la parte después de /storage/
        if (preg_match('/\/storage\/(.+)$/', $path, $matches)) {
            return $matches[1];
        }

        return preg_replace('#^/?(?:public/)?storage/#', '', ltrim($path, '/'));
    }

    /**
     * Borrar archivo de imagen anterior
     */
    private function deleteOldImage($imageUrl)
    {
        if (!$imageUrl) return;

        try {
            $path = $this->extractPathFromUrl($imageUrl);
            if ($path && Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        } catch (\Exception $e) {
            \Log::warning('Failed to delete old image: ' . $e->getMessage());
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $recetas = Receta::query()
            ->when($request->filled('dificultad'), function ($query) use ($request) {
                $query->where('dificultad', $request->query('dificultad'));
            })
            ->when($request->filled('alergeno'), function ($query) use ($request) {
                $query->whereDoesntHave('ingredientes', function ($query) use ($request) {
                    $query->whereHas('alergenos', function ($query) use ($request) {
                        $query->where('nombre', $request->query('alergeno'));
                    });
                });
            })
            ->when($request->query('orden') === 'masTiempo', function ($query) {
                $query->orderBy('tiempoCocinado', 'desc');
            })
            ->when($request->query('orden') === 'menosTiempo', function ($query) {
                $query->orderBy('tiempoCocinado', 'asc');
            })
            ->get();

        return new RecetaCollection($recetas);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CrearRecetaRequest $request)
    {
        $datos = $request->validated();

        // Asegurar que usuario_id viene del usuario autenticado
        $datos['usuario_id'] = $request->user()->id ?? $request->input('usuario_id');

        // NO usar imagen_url como input de string - solo procesar archivo
        // Remover campos que no son del modelo
        $ingredientesNombres = $datos['ingredientes'] ?? [];
        $pasos = $datos['pasos'] ?? [];
        $tiposComida = $datos['tipoComida'] ?? [];

        unset($datos['ingredientes']);
        unset($datos['pasos']);
        unset($datos['tipoComida']);
        unset($datos['imagen']); // Remover 'imagen' de los datos (viene como file, no como string)

        // Inicialmente sin imagen_url
        $datos['imagen_url'] = null;
        $receta = Receta::create($datos);

        // Procesar ingredientes
        $ingredientesIds = [];
        foreach ($ingredientesNombres as $nombre) {
            $ingrediente = Ingrediente::firstOrCreate(['nombre' => $nombre]);
            $ingredientesIds[] = $ingrediente->id;
        }
        $receta->ingredientes()->sync($ingredientesIds);

        // Procesar pasos
        if (!empty($pasos)) {
            $pasosData = [];
            foreach ($pasos as $paso) {
                $pasosData[] = [
                    'receta_id' => $receta->id,
                    'paso' => $paso
                ];
            }
            $receta->pasos()->createMany($pasosData);
        }

        // Procesar tipos de comida
        if (!empty($tiposComida)) {
            $tiposComidaIds = [];
            foreach ($tiposComida as $nombreTipo) {
                $tipoComida = TipoComida::firstOrCreate(['nombre' => $nombreTipo]);
                $tiposComidaIds[] = $tipoComida->id;
            }
            $receta->tipoComida()->sync($tiposComidaIds);
        }

        // Procesar imagen si existe
        if ($request->hasFile('imagen')) {
            try {
                $imagen = $request->file('imagen');
                
                // Validar tipo MIME
                $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!in_array($imagen->getMimeType(), $allowedMimes)) {
                    throw new \Exception('Tipo de archivo no permitido');
                }

                // Validar tamaño (5MB máximo)
                if ($imagen->getSize() > 5 * 1024 * 1024) {
                    throw new \Exception('El archivo es demasiado grande (máx 5MB)');
                }

                // Generar nombre único
                $nombreImagen = time() . '_' . Str::random(8) . '.' . $imagen->getClientOriginalExtension();
                $rutaImagen = $imagen->storeAs('recetas', $nombreImagen, 'public');

                $receta->imagen_url = $rutaImagen;
                $receta->save();
            } catch (\Exception $e) {
                // Log pero no romper la respuesta
                \Log::warning('Failed to store image during receta creation: ' . $e->getMessage());
            }
        }

        $receta->load(['ingredientes', 'pasos', 'tipoComida']);
        return new RecetaResource($receta);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $receta = Receta::where("id", "=", $id)->get();
        return new RecetaCollection($receta);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(CrearRecetaRequest $request, Receta $receta)
    {
        $datos = $request->validated();

        // NO usar imagen_url como input de string - solo procesar archivo
        $ingredientesData = $datos['ingredientes'] ?? [];
        $pasosData = $datos['pasos'] ?? [];
        $tiposComidaData = $datos['tipoComida'] ?? [];

        unset($datos['ingredientes']);
        unset($datos['pasos']);
        unset($datos['tipoComida']);
        unset($datos['imagen']); // Remover 'imagen' de los datos

        // Actualizar campos básicos (sin tocar imagen_url aquí)
        $receta->update([
            'nombre' => $datos['nombre'] ?? $receta->nombre,
            'tipoCocina' => $datos['tipoCocina'] ?? $receta->tipoCocina,
            'dificultad' => $datos['dificultad'] ?? $receta->dificultad,
            'tiempoCocinado' => $datos['tiempoCocinado'] ?? $receta->tiempoCocinado,
            'porciones' => $datos['porciones'] ?? $receta->porciones,
            'caloriasPorPorcion' => $datos['caloriasPorPorcion'] ?? $receta->caloriasPorPorcion,
        ]);

        // Actualizar ingredientes
        if (!empty($ingredientesData)) {
            $ingredientesIds = [];
            foreach ($ingredientesData as $ingredienteData) {
                $nombreIngrediente = is_array($ingredienteData)
                    ? ($ingredienteData['nombre'] ?? $ingredienteData['nombreIngrediente'] ?? null)
                    : $ingredienteData;

                if ($nombreIngrediente) {
                    $ingrediente = Ingrediente::firstOrCreate(['nombre' => $nombreIngrediente]);
                    $ingredientesIds[] = $ingrediente->id;
                }
            }
            $receta->ingredientes()->sync($ingredientesIds);
        }

        // Actualizar pasos
        if (!empty($pasosData)) {
            $receta->pasos()->delete();
            $nuevosPasosData = [];
            foreach ($pasosData as $pasoData) {
                $textoPaso = is_array($pasoData)
                    ? ($pasoData['paso'] ?? $pasoData['nombrePaso'] ?? null)
                    : $pasoData;

                if ($textoPaso) {
                    $nuevosPasosData[] = [
                        'receta_id' => $receta->id,
                        'paso' => $textoPaso
                    ];
                }
            }
            if (!empty($nuevosPasosData)) {
                $receta->pasos()->createMany($nuevosPasosData);
            }
        }

        // Actualizar tipos de comida
        if (!empty($tiposComidaData)) {
            $tiposComidaIds = [];
            foreach ($tiposComidaData as $tipoComidaData) {
                $nombreTipoComida = is_array($tipoComidaData)
                    ? ($tipoComidaData['nombre'] ?? null)
                    : $tipoComidaData;

                if ($nombreTipoComida) {
                    $tipoComida = TipoComida::firstOrCreate(['nombre' => $nombreTipoComida]);
                    $tiposComidaIds[] = $tipoComida->id;
                }
            }
            if (!empty($tiposComidaIds)) {
                $receta->tipoComida()->sync($tiposComidaIds);
            }
        }

        // Procesar imagen si es nueva
        if ($request->hasFile('imagen')) {
            try {
                $imagen = $request->file('imagen');
                
                // Validar tipo MIME
                $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!in_array($imagen->getMimeType(), $allowedMimes)) {
                    throw new \Exception('Tipo de archivo no permitido');
                }

                // Validar tamaño (5MB máximo)
                if ($imagen->getSize() > 5 * 1024 * 1024) {
                    throw new \Exception('El archivo es demasiado grande (máx 5MB)');
                }

                // Eliminar imagen antigua
                $this->deleteOldImage($receta->imagen_url);

                // Guardar imagen nueva
                $nombreImagen = time() . '_' . Str::random(8) . '.' . $imagen->getClientOriginalExtension();
                $rutaImagen = $imagen->storeAs('recetas', $nombreImagen, 'public');

                $receta->imagen_url = $rutaImagen;
                $receta->save();
            } catch (\Exception $e) {
                // Log pero no romper la respuesta
                \Log::warning('Failed to update image during receta update: ' . $e->getMessage());
            }
        }

        $receta->load(['ingredientes', 'pasos', 'tipoComida']);
        return new RecetaResource($receta);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $receta = Receta::findOrFail($id);

            // Eliminar archivo de imagen si existe
            $this->deleteOldImage($receta->imagen_url);

            // Eliminar relaciones
            $receta->ingredientes()->detach();
            $receta->reseñas()->delete();
            $receta->pasos()->delete();
            $receta->tipoComida()->detach();

            // Eliminar receta
            $receta->delete();

            return response()->json(['message' => 'Receta eliminada correctamente'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al eliminar la receta', 'error' => $e->getMessage()], 500);
        }
    }

    public function recetasMejorValoradas()
    {
        $recetas = Receta::with('reseñas')
            ->withAvg('reseñas', 'puntuacion')
            ->orderByDesc('reseñas_avg_puntuacion')
            ->take(9)
            ->get();

        return new RecetaCollection($recetas);
    }

    public function recetasSinAlergeno($alergeno)
    {
        $recetas = Receta::whereDoesntHave('ingredientes', function ($query) use ($alergeno) {
            $query->whereHas('alergenos', function ($query) use ($alergeno) {
                $query->where('nombre', $alergeno);
            });
        })->get();

        return new RecetaCollection($recetas);
    }

    public function recetasMasTiempo()
    {
        $recetas = Receta::orderBy('tiempoCocinado', 'desc')->get();
        return new RecetaCollection($recetas);
    }

    public function recetasMenosTiempo()
    {
        $recetas = Receta::orderBy('tiempoCocinado', 'asc')->get();
        return new RecetaCollection($recetas);
    }

    public function recetasPorDificultad($dificultad)
    {
        $recetas = Receta::where('dificultad', $dificultad)->get();
        return new RecetaCollection($recetas);
    }


    public function subirImagen(Request $request)
    {
        $request->validate([
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ]);

        try {
            if ($request->hasFile('imagen')) {
                $imagen = $request->file('imagen');

                // Validar tipo MIME
                $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                if (!in_array($imagen->getMimeType(), $allowedMimes)) {
                    throw new \Exception('Tipo de archivo no permitido');
                }

                // Validar tamaño (5MB máximo)
                if ($imagen->getSize() > 5 * 1024 * 1024) {
                    throw new \Exception('El archivo es demasiado grande (máx 5MB)');
                }

                // Generar nombre único
                $nombreImagen = time() . '_' . Str::random(8) . '.' . $imagen->getClientOriginalExtension();
                $rutaImagen = $imagen->storeAs('recetas', $nombreImagen, 'public');

                $urlImagen = $this->generateImageUrl($rutaImagen);

                return response()->json([
                    'mensaje' => 'Imagen subida correctamente',
                    'url' => $urlImagen,
                    'path' => $rutaImagen,
                    'data' => ['url' => $urlImagen, 'path' => $rutaImagen]
                ], 200);
            }

            return response()->json([
                'error' => 'No se encontró ninguna imagen'
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al subir la imagen',
                'mensaje' => $e->getMessage()
            ], 500);
        }
    }

    public function recetasPorTipoComida($tipoComida)
    {
        $recetas = Receta::whereHas('tipoComida', function ($query) use ($tipoComida) {
            $query->where('nombre', $tipoComida);
        })->get();

        return new RecetaCollection($recetas);
    }


    public function dificultades(){
        $recetas = Receta::select('dificultad')->distinct()->get();

        return response()->json($recetas);
    }

    public function recetasPorUsuario($id)
    {
        $recetas = Receta::where('usuario_id', $id)->get();
        return new RecetaCollection($recetas);
    }
}
