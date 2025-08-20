<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
	use HasFactory, Notifiable;

	protected $fillable = [
		'name',
		'email',
		'password',
		'role',
		'registration_date',
	];

	protected $hidden = [
		'password',
		'remember_token',
	];

	public function getJWTIdentifier()
	{
		return $this->getKey();
	}

	public function getJWTCustomClaims()
	{
		return [];
	}

	public function ratings()
	{
		return $this->hasMany(Rating::class);
	}

	public function comments()
	{
		return $this->hasMany(Comment::class);
	}

	public function lists()
	{
		return $this->hasMany(UserList::class);
	}

	public function createDefaultLists()
	{
		$defaultLists = [
			'Watched movies',
			'Watched series',
			'Movies to watch',
			'Series to watch',
		];

		foreach ($defaultLists as $listName) {
			$this->lists()->firstOrCreate([
				'name' => $listName,
			], [
				'description' => "Lista predeterminada: $listName",
			]);
		}
	}

	protected static function booted()
	{
		static::created(function ($user) {
			$user->createDefaultLists();
		});
	}
}
