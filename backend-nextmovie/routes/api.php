<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\UserListItemController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\UserListController;

Route::get('/', function () {
    return response()->json(['status' => 'API Laravel en funcionamiento']);
});

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::get('/me', [AuthController::class, 'me'])->middleware('auth:api');
});

Route::middleware('auth:api')->group(function () {

    Route::get('/users/{id}/profile-data', [UserController::class, 'profileData']);
    Route::put('/users/{id}', [UserController::class, 'update']);
    Route::get('/users', [UserController::class, 'index']); 
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::get('/comments', [CommentController::class, 'index']);
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{id}', [CommentController::class, 'update']);
    Route::delete('/comments/{id}', [CommentController::class, 'destroy']);

    Route::post('/ratings', [RatingController::class, 'store']);
    Route::put('/ratings/{id}', [RatingController::class, 'update']);
    Route::get('/ratings/user/{user_id}', [RatingController::class, 'getRatingsByUser']);

    Route::post('/user-list-items', [UserListItemController::class, 'store']);
    Route::delete('/user-list-items/{id}', [UserListItemController::class, 'destroy']);

    Route::get('/user-lists', [UserListController::class, 'index']);
    Route::get('/user-lists/{id}', [UserListController::class, 'show']);
    Route::post('/user-lists', [UserListController::class, 'store']);
    Route::put('/user-lists/{id}', [UserListController::class, 'update']);
    Route::delete('/user-lists/{id}', [UserListController::class, 'destroy']);
});

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{id}', [MovieController::class, 'show']);

Route::get('/movies/{movie_id}/comments', [CommentController::class, 'getCommentsByMovie']);
