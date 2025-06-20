<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\UserList;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class UserListControllerTest extends TestCase
{
    use RefreshDatabase;

	/** @test */
    public function it_creates_a_user_list()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $data = [
            'name' => 'My Favorite Movies',
            'description' => 'A list of my favorite movies.',
            'user_id' => $user->id,
        ];

        $response = $this->postJson('/api/user-lists', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('user_lists', [
            'name' => 'My Favorite Movies',
            'user_id' => $user->id,
        ]);
    }

	/** @test */
	public function it_deletes_a_user_list()
    {
        $user = User::factory()->create();

        $this->actingAs($user, 'api');

        $userList = UserList::factory()->create(['user_id' => $user->id]);

        $response = $this->deleteJson('/api/user-lists/' . $userList->id);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('user_lists', [
            'id' => $userList->id,
        ]);
    }
}
