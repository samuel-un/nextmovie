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
		'title'
	];

	public function list()
	{
		return $this->belongsTo(UserList::class, 'list_id');
	}

	public function movie()
	{
		return $this->belongsTo(Movie::class, 'movie_id', 'id_tmdb');
	}
}
