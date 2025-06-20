<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use App\Models\Rating;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RatingControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_a_rating()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create([
            'id_tmdb' => 123456,
        ]);

        $this->actingAs($user, 'api');

        $response = $this->postJson('/api/ratings', [
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'score' => 4,
            'rated_at' => '2025-06-20 10:00:00',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('ratings', [
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'score' => 4,
        ]);
    }

    /** @test */
    public function it_updates_a_rating()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create([
            'id_tmdb' => 123456,
        ]);
        $rating = Rating::create([
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'score' => 3,
        ]);

        $this->actingAs($user, 'api');

        $response = $this->putJson("/api/ratings/{$rating->id}", [
            'score' => 5,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('ratings', [
            'id' => $rating->id,
            'score' => 5,
        ]);
    }

    
}
