<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MovieControllerTest extends TestCase
{
	use RefreshDatabase;

	public function it_creates_a_movie()
	{
		$response = $this->postJson('/api/movies', [
			'title' => 'Test Movie',
			'description' => 'A test movie description.',
			'release_date' => '2025-06-20',
			'id_tmdb' => 123456,
		]);

		$response->assertStatus(201);
		$this->assertDatabaseHas('movies', [
			'title' => 'Test Movie',
			'id_tmdb' => 123456,
		]);
	}

	public function it_shows_a_movie()
	{
		$movie = Movie::factory()->create([
			'title' => 'Test Movie for Show',
			'id_tmdb' => 654321,
		]);

		$response = $this->getJson("/api/movies/{$movie->id}");

		$response->assertStatus(200);

		$response->assertJsonFragment([
			'title' => 'Test Movie for Show',
			'id_tmdb' => 654321,
		]);
	}
}