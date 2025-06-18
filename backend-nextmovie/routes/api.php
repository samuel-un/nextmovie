<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

Route::get('/', function () {
    return response()->json(['status' => 'API Laravel en funcionamiento']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

// Rutas de usuario protegidas
Route::middleware('auth:api')->group(function () {
    Route::get('/users/{id}/profile-data', [UserController::class, 'profileData']);
    Route::put('/users/{id}', [UserController::class, 'update']);
});
