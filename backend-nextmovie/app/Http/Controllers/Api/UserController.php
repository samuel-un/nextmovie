<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
	public function index()
	{
		$users = User::all();
		return response()->json($users, 200);
	}

	public function show($id)
	{
		$user = User::findOrFail($id);
		return response()->json($user, 200);
	}

	public function store(Request $request)
	{
		$data = $request->all();
		$data['password'] = bcrypt($data['password']);
		$user = User::create($data);
		return response()->json($user, 201);
	}


    public function update(Request $request, $id)
	{
		$user = User::findOrFail($id);
		$data = $request->all();
		if (isset($data['password'])) {
			$data['password'] = bcrypt($data['password']);
		}
		$user->update($data);
		return response()->json($user, 200);
	}


    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(null, 204);
    }
}