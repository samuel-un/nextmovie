<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserListItem;
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
        $item = UserListItem::create($request->all());
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