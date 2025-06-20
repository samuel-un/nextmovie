<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Movie extends Model
{
	use HasFactory;

	protected $primaryKey = 'id_tmdb';
	public $incrementing = false;
	protected $keyType = 'int';

	protected $fillable = ['id_tmdb', 'title', 'type', 'poster_url', 'release_date'];

	public function ratings()
	{
		return $this->hasMany(Rating::class, 'movie_id', 'id_tmdb');
	}

	public function comments()
	{
		return $this->hasMany(Comment::class, 'movie_id', 'id_tmdb');
	}

	public function userListItems()
	{
		return $this->hasMany(UserListItem::class, 'movie_id', 'id_tmdb');
	}
}
