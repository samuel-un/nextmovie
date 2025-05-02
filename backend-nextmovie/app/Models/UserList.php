<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserList extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'description',
    ];

    // Una lista pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Una lista puede tener muchos elementos
    public function items()
    {
        return $this->hasMany(UserListItem::class, 'list_id');
    }
}