<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Rating extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'score',
        'rated_at',
    ];

    // Una valoración pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Una valoración pertenece a una película
    public function movie()
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id_tmdb');
    }
}