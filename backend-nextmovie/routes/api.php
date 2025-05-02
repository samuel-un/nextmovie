<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json(['message' => '¡Funciona la API de Laravel!']);
});

use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\UserListController;
use App\Http\Controllers\Api\UserListItemController;

Route::apiResource('users', UserController::class);
Route::apiResource('movies', MovieController::class);
Route::apiResource('ratings', RatingController::class);
Route::apiResource('comments', CommentController::class);
Route::apiResource('user-lists', UserListController::class);
Route::apiResource('user-list-items', UserListItemController::class);