<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Comment;
use App\Models\User;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CommentTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_list_all_comments()
    {
        Comment::factory()->count(3)->create();

        $response = $this->getJson('/api/comments');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_show_a_single_comment()
    {
        $comment = Comment::factory()->create();

        $response = $this->getJson("/api/comments/{$comment->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $comment->id,
                     'comment_text' => $comment->comment_text,
                 ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_create_a_comment()
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();

        $payload = [
            'user_id' => $user->id,
            'movie_id' => $movie->id_tmdb,
            'comment_text' => 'This is a test comment',
            'commented_at' => now()->toDateTimeString(),
        ];

        $response = $this->postJson('/api/comments', $payload);

        $response->assertStatus(201)
                 ->assertJsonFragment(['comment_text' => 'This is a test comment']);

        $this->assertDatabaseHas('comments', ['comment_text' => 'This is a test comment']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_update_a_comment()
    {
        $comment = Comment::factory()->create([
            'comment_text' => 'Old comment',
        ]);

        $payload = [
            'comment_text' => 'Updated comment',
        ];

        $response = $this->putJson("/api/comments/{$comment->id}", $payload);

        $response->assertStatus(200)
                 ->assertJsonFragment(['comment_text' => 'Updated comment']);

        $this->assertDatabaseHas('comments', ['comment_text' => 'Updated comment']);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_delete_a_comment()
    {
        $comment = Comment::factory()->create();

        $response = $this->deleteJson("/api/comments/{$comment->id}");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('comments', ['id' => $comment->id]);
    }
}