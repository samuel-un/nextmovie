<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Movie;
use App\Models\Rating;

class RatingTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_can_be_created_with_factory()
    {
        $rating = Rating::factory()->create();
        $this->assertDatabaseHas('ratings', ['id' => $rating->id]);
    }

    public function test_can_create_rating_via_api()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        $this->actingAs($user);

        $response = $this->postJson('/api/ratings', [
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'score' => 5,
            'rated_at' => now(),
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['score' => 5]);
        $this->assertDatabaseHas('ratings', [
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'score' => 5,
        ]);
    }

    public function test_can_update_rating_via_api()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();
        $rating = Rating::factory()->create([
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
        ]);

        $this->actingAs($user);

        $response = $this->putJson("/api/ratings/{$rating->id}", [
            'score' => 3,
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['score' => 3]);
    }

    public function test_can_delete_rating_via_api()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();
        $rating = Rating::factory()->create([
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
        ]);

        $this->actingAs($user);

        $response = $this->deleteJson("/api/ratings/{$rating->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('ratings', ['id' => $rating->id]);
    }
}