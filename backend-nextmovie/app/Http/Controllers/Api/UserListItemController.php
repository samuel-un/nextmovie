<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserListItem;
use App\Models\Movie;
use Illuminate\Http\Request;

class UserListItemController extends Controller
{
	public function index()
	{
		return UserListItem::all();
	}

	public function show($id)
	{
		return UserListItem::findOrFail($id);
	}

	public function store(Request $request)
	{
		$request->validate([
			'list_id' => 'required|exists:user_lists,id',
			'movie_id' => 'required|integer',
			'title' => 'required|string|max:255',
			'type' => 'required|in:movie,series',
		]);

		Movie::updateOrCreate(
			['id_tmdb' => $request->movie_id],
			[
				'title' => $request->title ?? 'Título desconocido',
				'type' => $request->type,
			]
		);

		$exists = UserListItem::where('list_id', $request->list_id)
			->where('movie_id', $request->movie_id)
			->exists();

		if ($exists) {
			return response()->json([
				'error' => 'La película ya está en la lista'
			], 409);
		}

		$item = UserListItem::create([
			'list_id' => $request->list_id,
			'movie_id' => $request->movie_id,
			'title' => $request->title,
			'added_at' => now(),
		]);

		return response()->json($item, 201);
	}

	public function update(Request $request, $id)
	{
		$item = UserListItem::findOrFail($id);
		$item->update($request->all());
		return response()->json($item, 200);
	}

	public function destroy($id)
	{
		UserListItem::destroy($id);
		return response()->json(null, 204);
	}
}
