<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_can_be_created_with_factory()
    {
        $user = User::factory()->create();
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }

    public function test_can_create_user_via_api()
    {
        $response = $this->postJson('/api/users', [
            'name' => 'API User',
            'email' => 'apiuser@example.com',
            'password' => 'Password123!',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['email' => 'apiuser@example.com']);
        $this->assertDatabaseHas('users', ['email' => 'apiuser@example.com']);
    }

    public function test_can_list_users_via_api()
    {
        User::factory()->count(3)->create();
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/users');
        $response->assertStatus(200)
                 ->assertJsonStructure([['id', 'name', 'email']]);
    }

    public function test_can_show_user_via_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson("/api/users/{$user->id}");
        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_can_update_user_via_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->putJson("/api/users/{$user->id}", [
            'name' => 'Updated User Name',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['name' => 'Updated User Name']);
    }

    public function test_can_delete_user_via_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->deleteJson("/api/users/{$user->id}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}