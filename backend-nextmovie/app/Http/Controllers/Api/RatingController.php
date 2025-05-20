<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RatingController extends Controller
{
    public function index()
    {
        return Rating::all();
    }

    public function show($id)
    {
        return Rating::findOrFail($id);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'movie_id' => 'required|exists:movies,id_tmdb',
                'score' => 'required|integer|min:1|max:5',
                'rated_at' => 'nullable|date',
            ]);

            if (!empty($validated['rated_at'])) {
                // Convierte la fecha a formato MySQL compatible
                $validated['rated_at'] = date('Y-m-d H:i:s', strtotime($validated['rated_at']));
            }

            $rating = Rating::create($validated);
            return response()->json($rating, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Error creating rating: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $rating = Rating::findOrFail($id);
        $rating->update($request->all());
        return response()->json($rating, 200);
    }

    public function destroy($id)
    {
        Rating::destroy($id);
        return response()->json(null, 204);
    }
}