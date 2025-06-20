<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\UserListItemController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\RatingController;

Route::get('/', function () {
	return response()->json(['status' => 'API Laravel en funcionamiento']);
});

// 🔐 Autenticación
Route::prefix('auth')->group(function () {
	Route::post('/register', [AuthController::class, 'register'])->name('register');
	Route::post('/login', [AuthController::class, 'login'])->name('login');
	Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
	Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

// 📁 Rutas protegidas con autenticación api
Route::middleware('auth:api')->group(function () {

	// 👤 Datos y actualización usuario
	Route::get('/users/{id}/profile-data', [UserController::class, 'profileData']);
	Route::put('/users/{id}', [UserController::class, 'update']);

	// 💬 Comentarios (todos o filtrados)
	Route::get('/comments', [CommentController::class, 'index']);
	Route::post('/comments', [CommentController::class, 'store']);
	Route::put('/comments/{id}', [CommentController::class, 'update']);
	Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

	// ⭐ Ratings
	Route::post('/ratings', [RatingController::class, 'store']);
	Route::put('/ratings/{id}', [RatingController::class, 'update']);
	Route::get('/ratings/user/{user_id}', [RatingController::class, 'getRatingsByUser']);

	// 🗃️ Ítems de listas de usuario
	Route::post('/user-list-items', [UserListItemController::class, 'store']);
	Route::delete('/user-list-items/{id}', [UserListItemController::class, 'destroy']);
});

// 🎬 Películas (públicas)
Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

// 💬 Comentarios públicos por película
Route::get('/movies/{movie_id}/comments', [CommentController::class, 'getCommentsByMovie']);
