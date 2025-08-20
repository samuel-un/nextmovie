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
		$validated = $request->validate([
			'movie_id' => 'required|exists:movies,id_tmdb',
			'comment_text' => 'required|string',
			'commented_at' => 'nullable|date_format:Y-m-d H:i:s',
			'comment_rating' => 'nullable|numeric|min:0|max:10',
		]);

		$validated['user_id'] = auth()->id();

		if (isset($validated['commented_at'])) {
			$validated['commented_at'] = Carbon::parse($validated['commented_at'])->format('Y-m-d H:i:s');
		}

		$comment = Comment::create($validated);

		return response()->json($comment, 201);
	}

	public function update(Request $request, $id)
	{
		$comment = Comment::findOrFail($id);

		$validated = $request->validate([
			'comment_text' => 'sometimes|required|string',
			'commented_at' => 'nullable|date_format:Y-m-d H:i:s',
			'comment_rating' => 'nullable|numeric|min:0|max:10',
		]);

		if (isset($validated['commented_at'])) {
			$validated['commented_at'] = Carbon::parse($validated['commented_at'])->format('Y-m-d H:i:s');
		}

		$comment->update($validated);

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
