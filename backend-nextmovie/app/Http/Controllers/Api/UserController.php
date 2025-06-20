<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\ListModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
	public function index()
	{
		return response()->json(User::all());
	}

	public function show($id)
	{
		$user = User::findOrFail($id);
		return response()->json($user);
	}

	public function destroy($id)
	{
		$user = User::findOrFail($id);
		$user->delete();

		return response()->json(['message' => 'User successfully deleted']);
	}

	public function update(Request $request, $id)
	{
		$authUser = auth()->user();
		if ((int)$authUser->id !== (int)$id) {
			return response()->json(['message' => 'Unauthorized'], 403);
		}

		$user = User::findOrFail($id);

		$validated = $request->validate([
			'name' => 'sometimes|string|max:255',
			'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
			'current_password' => 'nullable|string',
			'new_password' => 'nullable|string|min:6',
		]);

		if (!empty($validated['new_password'])) {
			if (empty($validated['current_password']) || !Hash::check($validated['current_password'], $user->password)) {
				return response()->json(['message' => 'Current password is incorrect.'], 422);
			}
			$user->password = bcrypt($validated['new_password']);
		}

		if (isset($validated['name'])) {
			$user->name = $validated['name'];
		}
		if (isset($validated['email'])) {
			$user->email = $validated['email'];
		}

		$user->save();

		return response()->json([
			'message' => 'Profile successfully updated',
			'user' => [
				'id' => $user->id,
				'name' => $user->name,
				'email' => $user->email,
			]
		]);
	}

	public function profileData($id)
	{
		$authUser = auth()->user();
		if ((int)$authUser->id !== (int)$id) {
			return response()->json(['message' => 'Unauthorized'], 403);
		}

		// Nombres de listas predeterminadas
		$defaultLists = [
			'Watched movies',
			'Watched series',
			'Movies to watch',
			'Series to watch',
		];

		// Crear las listas predeterminadas si no existen
		foreach ($defaultLists as $listName) {
			\App\Models\UserList::firstOrCreate(
				['user_id' => $id, 'name' => $listName],
				['description' => "Lista predeterminada: $listName"]
			);
		}

		// Recargar el usuario con listas y items
		$user = User::with('lists.items.movie')->findOrFail($id);

		$lists = $user->lists->map(function ($list) {
			return [
				'id' => $list->id,
				'name' => $list->name,
				'items' => $list->items->map(function ($item) {
					return [
						'id' => $item->id,
						'tmdbId' => $item->movie ? $item->movie->id_tmdb : null,
						'title' => $item->movie ? $item->movie->title : null,
						'poster' => $item->movie ? $item->movie->poster_url : null,
						'media_type' => $item->movie ? $item->movie->type : null,
					];
				}),
			];
		});


		$total_hours = $user->lists
			->flatMap(fn($list) => $list->items)
			->sum(fn($item) => $item->movie ? ($item->movie->duration ?? 0) : 0);

		$total_movies = $user->lists
			->flatMap(fn($list) => $list->items)
			->filter(fn($item) => $item->movie && $item->movie->type === 'movie')
			->count();

		$total_series = $user->lists
			->flatMap(fn($list) => $list->items)
			->filter(fn($item) => $item->movie && $item->movie->type === 'series')
			->count();

		return response()->json([
			'user' => [
				'id' => $user->id,
				'name' => $user->name,
				'email' => $user->email,
			],
			'lists' => $lists,
			'stats' => [
				'total_hours' => $total_hours,
				'total_movies' => $total_movies,
				'total_series' => $total_series,
			],
		]);
	}
}
