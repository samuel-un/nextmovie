<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
	use RefreshDatabase;

	/** @test */
	public function it_fetches_all_users()
	{
		$user1 = User::factory()->create();
		$user2 = User::factory()->create();

		$this->actingAs($user1, 'api');

		$response = $this->getJson('/api/users');

		$response->assertStatus(200);
		$response->assertJsonFragment(['id' => $user1->id]);
		$response->assertJsonFragment(['id' => $user2->id]);
	}

	/** @test */
	public function it_updates_a_user()
	{
		$user = User::factory()->create(['password' => bcrypt('password123')]);
		$this->actingAs($user, 'api');

		$response = $this->putJson("/api/users/{$user->id}", [
			'name' => 'Updated Name',
			'email' => 'updatedemail@example.com',
			'current_password' => 'password123',
			'new_password' => 'newpassword123',
		]);

		$response->assertStatus(200);
		$this->assertDatabaseHas('users', [
			'id' => $user->id,
			'name' => 'Updated Name',
			'email' => 'updatedemail@example.com',
		]);
	}

	/** @test */
	public function it_deletes_a_user()
	{
		$user = User::factory()->create();

		$this->actingAs($user, 'api');

		$response = $this->deleteJson("/api/users/{$user->id}");

		$response->assertStatus(200);

		$this->assertDatabaseMissing('users', [
			'id' => $user->id,
		]);
	}
}
