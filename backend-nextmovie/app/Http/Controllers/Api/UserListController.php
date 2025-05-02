<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserList;
use Illuminate\Http\Request;

class UserListController extends Controller
{
    public function index()
    {
        return UserList::all();
    }

    public function show($id)
    {
        return UserList::findOrFail($id);
    }

    public function store(Request $request)
    {
        $list = UserList::create($request->all());
        return response()->json($list, 201);
    }

    public function update(Request $request, $id)
    {
        $list = UserList::findOrFail($id);
        $list->update($request->all());
        return response()->json($list, 200);
    }

    public function destroy($id)
    {
        UserList::destroy($id);
        return response()->json(null, 204);
    }
}