<?php

namespace App\Http\Resources;

use App\Models\TipoComida;
use App\Models\TipoComidaReceta;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RecetaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $tipoComida = [];

        $tipoComidasReceta = TipoComidaReceta::where('receta_id', $this->id)->get();

        foreach ($tipoComidasReceta as $id) {
            $tipoComida[] = TipoComida::where('id', $id->tipo_comida_id)->first()->nombre;
        }

        $this->load('reseñas');

        $mediaValoracion = $this->reseñas->avg('puntuacion');
        $mediaValoracionFormateada = $mediaValoracion ? round($mediaValoracion * 10) / 10 : null;

        $cacheBuster = $this->updated_at ? $this->updated_at->timestamp : time();
        $imagenUrl = $this->buildImageUrl($request, $this->imagen_url);
        $imagenUrl = $imagenUrl ? ($imagenUrl . '?v=' . $cacheBuster) : null;

        return [
            'id' => $this->id,
            'usuario_id' => $this->usuario_id,
            'nombre' => $this->nombre,
            'imagen' => $imagenUrl,
            'imagen_url' => $imagenUrl,
            'imagen_cache' => $cacheBuster,
            'tipoCocina' => $this->tipoCocina,
            'tipoComida' => !empty($tipoComida) ? $tipoComida : $this->tipoComida,
            'tiempoCocinado' => $this->tiempoCocinado,
            'dificultad' => $this->dificultad,
            'porciones' => $this->porciones,
            'caloriasPorPorcion' => $this->caloriasPorPorcion,
            'ingredientes' => new IngredienteNombreCollection($this->ingredientes),
            'pasos' => new PasoNombreCollection($this->pasos),
            'valoracion' => $mediaValoracionFormateada,
        ];
    }

    private function buildImageUrl(Request $request, ?string $raw): ?string
    {
        if (!$raw) return null;

        if (preg_match('/^https?:\/\//', $raw)) {
            if (str_contains($raw, 'localhost') || str_contains($raw, '127.0.0.1')) {
                $path = $this->extractStoragePath($raw);
                return $path ? $this->storageBaseUrl($request) . '/storage/' . $path : $raw;
            }

            return $raw;
        }

        return $this->storageBaseUrl($request) . '/storage/' . $this->extractStoragePath($raw);
    }

    private function storageBaseUrl(Request $request): string
    {
        $basePath = str_replace('/index.php', '', $request->getBaseUrl());
        return rtrim($request->getSchemeAndHttpHost() . $basePath, '/');
    }

    private function extractStoragePath(string $value): string
    {
        $path = parse_url($value, PHP_URL_PATH) ?: $value;
        $path = preg_replace('#^/?(?:public/)?storage/#', '', $path);
        return ltrim($path, '/');
    }
}
