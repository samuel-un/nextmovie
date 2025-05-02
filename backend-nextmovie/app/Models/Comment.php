<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'movie_id',
        'comment_text',
        'commented_at',
    ];

    // Un comentario pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Un comentario pertenece a una película
    public function movie()
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id_tmdb');
    }
}