<?php

namespace Tests\Feature;

use App\Models\Comment;
use App\Models\User;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommentControllerTest extends TestCase
{
    use RefreshDatabase;

	/** @test */
	public function it_creates_a_comment()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create(['id_tmdb' => 123456]);

        $response = $this->actingAs($user)->postJson('/api/comments', [
            'movie_id' => $movie->id_tmdb,
            'comment_text' => 'Gran película',
            'commented_at' => now()->format('Y-m-d H:i:s'),
            'comment_rating' => 8.5,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('comments', [
            'movie_id' => $movie->id_tmdb,
            'comment_text' => 'Gran película',
        ]);
    }

	/** @test */
    public function it_updates_a_comment()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create(['id_tmdb' => 78910]);
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'comment_text' => 'Antiguo texto',
        ]);

        $response = $this->actingAs($user)->putJson("/api/comments/{$comment->id}", [
            'comment_text' => 'Texto actualizado',
            'comment_rating' => 9,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('comments', [
            'id' => $comment->id,
            'comment_text' => 'Texto actualizado',
            'comment_rating' => 9,
        ]);
    }

	/** @test */
    public function it_deletes_a_comment()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create(['id_tmdb' => 456789]);
        $comment = Comment::factory()->create([
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
        ]);

        $response = $this->actingAs($user)->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }
}
