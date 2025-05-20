<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\UserList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class UserListTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_list_all_user_lists()
    {
        UserList::factory()->count(3)->create();

        $response = $this->getJson('/api/user-lists');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    #[Test]
    public function it_can_show_a_single_user_list()
    {
        $userList = UserList::factory()->create();

        $response = $this->getJson("/api/user-lists/{$userList->id}");

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $userList->id,
                     'name' => $userList->name,
                 ]);
    }

    #[Test]
    public function it_can_create_a_user_list()
    {
        $user = User::factory()->create();

        $data = [
            'user_id' => $user->id,
            'name' => 'My Favorite Movies',
            'description' => 'List of movies I like',
        ];

        $response = $this->postJson('/api/user-lists', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['name' => 'My Favorite Movies']);

        $this->assertDatabaseHas('user_lists', $data);
    }

    #[Test]
    public function it_can_update_a_user_list()
    {
        $userList = UserList::factory()->create();

        $data = [
            'name' => 'Updated List Name',
            'description' => 'Updated description',
        ];

        $response = $this->putJson("/api/user-lists/{$userList->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Updated List Name']);

        $this->assertDatabaseHas('user_lists', $data + ['id' => $userList->id]);
    }

    #[Test]
    public function it_can_delete_a_user_list()
    {
        $userList = UserList::factory()->create();

        $response = $this->deleteJson("/api/user-lists/{$userList->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('user_lists', ['id' => $userList->id]);
    }
}