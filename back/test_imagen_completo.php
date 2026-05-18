<?php

// Test para verificar que el backend devuelve imagen_url correctamente
// Ejecutar con: php artisan tinker < test_imagen_completo.php

$token = \App\Models\User::first()->createToken('test')->plainTextToken;

// Simular crear una receta con imagen (como lo hace el frontend)
$client = new \GuzzleHttp\Client([
    'base_uri' => 'http://localhost:8000',
    'headers' => [
        'Authorization' => "Bearer $token",
    ]
]);

$imagePath = '/tmp/test.png';
if (!file_exists($imagePath)) {
    imagepng(imagecreatetruecolor(100, 100), $imagePath);
}

try {
    $response = $client->post('/api/recetas', [
        'multipart' => [
            ['name' => 'nombre', 'contents' => 'Test Recipe'],
            ['name' => 'tipoCocina', 'contents' => 'Test'],
            ['name' => 'tiempoCocinado', 'contents' => '30'],
            ['name' => 'dificultad', 'contents' => 'Fácil'],
            ['name' => 'porciones', 'contents' => '4'],
            ['name' => 'caloriasPorPorcion', 'contents' => '100'],
            ['name' => 'tipoComida[]', 'contents' => 'Desayuno'],
            ['name' => 'ingredientes[]', 'contents' => 'Test'],
            ['name' => 'pasos[]', 'contents' => 'Paso 1'],
            ['name' => 'imagen', 'contents' => fopen($imagePath, 'r'), 'filename' => 'test.png'],
        ]
    ]);

    $data = json_decode($response->getBody(), true);
    
    echo "===== RESPUESTA DEL BACKEND =====\n";
    echo json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n\n";
    
    echo "===== ANÁLISIS =====\n";
    if (isset($data['id'])) {
        echo "✅ Estructura: Objeto directo\n";
        echo "   imagen_url: " . ($data['imagen_url'] ?? 'NULL') . "\n";
        echo "   imagen: " . ($data['imagen'] ?? 'NULL') . "\n";
    } else if (isset($data['data'])) {
        echo "✅ Estructura: Envuelto en 'data'\n";
        echo "   imagen_url: " . ($data['data']['imagen_url'] ?? 'NULL') . "\n";
        echo "   imagen: " . ($data['data']['imagen'] ?? 'NULL') . "\n";
    }
    
    // Verificar que el archivo existe
    $storagePath = __DIR__ . '/storage/app/public/recetas/';
    $files = glob($storagePath . '*');
    echo "\n✅ Archivos guardados: " . count($files) . "\n";
    foreach ($files as $f) {
        echo "   - " . basename($f) . "\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
