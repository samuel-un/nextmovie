<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rating;
use Illuminate\Http\Request;

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
        $rating = Rating::create($request->all());
        return response()->json($rating, 201);
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