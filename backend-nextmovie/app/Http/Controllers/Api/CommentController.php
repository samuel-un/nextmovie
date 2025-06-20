<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CommentController extends Controller
{
	public function index()
	{
		return Comment::all();
	}

	public function show($id)
	{
		return Comment::findOrFail($id);
	}

	public function store(Request $request)
	{
		// Validación de los datos
		$validated = $request->validate([
			'movie_id' => 'required|exists:movies,id_tmdb',
			'comment_text' => 'required|string',
			'commented_at' => 'nullable|date_format:Y-m-d H:i:s',  // Formato de fecha correcto
			'comment_rating' => 'nullable|numeric|min:0|max:10',
		]);

		// Asignamos el ID del usuario autenticado
		$validated['user_id'] = auth()->id();

		// Convertimos 'commented_at' al formato 'Y-m-d H:i:s' si se pasa
		if (isset($validated['commented_at'])) {
			$validated['commented_at'] = Carbon::parse($validated['commented_at'])->format('Y-m-d H:i:s');
		}

		// Creamos el comentario
		$comment = Comment::create($validated);

		// Respondemos con el comentario recién creado
		return response()->json($comment, 201);
	}

	public function update(Request $request, $id)
	{
		// Encontramos el comentario
		$comment = Comment::findOrFail($id);

		// Validación de los datos de actualización
		$validated = $request->validate([
			'comment_text' => 'sometimes|required|string',
			'commented_at' => 'nullable|date_format:Y-m-d H:i:s',
			'comment_rating' => 'nullable|numeric|min:0|max:10',
		]);

		// Convertimos 'commented_at' si está presente
		if (isset($validated['commented_at'])) {
			$validated['commented_at'] = Carbon::parse($validated['commented_at'])->format('Y-m-d H:i:s');
		}

		// Actualizamos el comentario
		$comment->update($validated);

		// Respondemos con el comentario actualizado
		return response()->json($comment, 200);
	}

	public function destroy($id)
	{
		Comment::destroy($id);
		return response()->json(null, 204);
	}

	public function getCommentsByMovie($movie_id)
	{
		$comments = Comment::with('user')
			->where('movie_id', $movie_id)
			->orderBy('commented_at', 'desc')
			->get();

		return response()->json($comments, 200);
	}
}
