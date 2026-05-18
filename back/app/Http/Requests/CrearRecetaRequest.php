<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CrearRecetaRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'ingredientes' => 'required|array|min:1',
            'tipoCocina' => 'required|string|max:255',
            'tipoComida' => 'required|array|min:1',
            'tiempoCocinado' => 'required|numeric|min:1',
            'dificultad' => 'required|string|in:Fácil,Media,Difícil',
            'pasos' => 'required|array|min:1',
            'porciones' => 'required|numeric|min:1',
            'caloriasPorPorcion' => 'required|numeric|min:0',
            'usuario_id' => 'nullable|exists:users,id',
            // La imagen es ARCHIVO, no URL de string
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
        ];
    }
}
