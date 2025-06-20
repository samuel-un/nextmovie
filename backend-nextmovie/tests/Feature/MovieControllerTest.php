<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MovieControllerTest extends TestCase
{
	use RefreshDatabase;
	
	/** @test */
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