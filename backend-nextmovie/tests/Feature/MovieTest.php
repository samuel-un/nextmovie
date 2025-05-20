<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Movie;
use App\Models\User;

class MovieTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_can_be_created_with_factory()
    {
        $movie = Movie::factory()->make();
        $this->assertInstanceOf(Movie::class, $movie);
        $this->assertNotNull($movie->title);
        $this->assertContains($movie->type, ['movie', 'series']);
    }

    public function test_can_create_movie_via_api()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson('/api/movies', [
            'id_tmdb' => 123456,
            'title' => 'Test Movie',
            'type' => 'movie',
            'poster_url' => 'http://example.com/poster.jpg',
            'release_date' => '2024-01-01',
        ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['title' => 'Test Movie']);
        $this->assertDatabaseHas('movies', ['title' => 'Test Movie']);
    }

    public function test_can_update_movie_via_api()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();
        $this->actingAs($user);

        $response = $this->putJson("/api/movies/{$movie->id_tmdb}", [
            'title' => 'Updated Movie',
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment(['title' => 'Updated Movie']);
        $this->assertDatabaseHas('movies', ['title' => 'Updated Movie']);
    }

    public function test_can_delete_movie_via_api()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();
        $this->actingAs($user);

        $response = $this->deleteJson("/api/movies/{$movie->id_tmdb}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('movies', ['id_tmdb' => $movie->id_tmdb]);
    }
}