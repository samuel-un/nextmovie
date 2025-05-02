<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserListItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'list_id',
        'movie_id',
        'added_at',
    ];

    // Un elemento de lista pertenece a una lista
    public function list()
    {
        return $this->belongsTo(UserList::class, 'list_id');
    }

    // Un elemento de lista pertenece a una película
    public function movie()
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id_tmdb');
    }
}