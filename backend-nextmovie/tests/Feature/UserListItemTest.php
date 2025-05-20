<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\UserListItem;
use App\Models\UserList;
use App\Models\Movie;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

class UserListItemTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_can_list_all_user_list_items()
    {
        UserListItem::factory()->count(3)->create();

        $response = $this->getJson('/api/user-list-items');

        $response->assertStatus(200)
                 ->assertJsonCount(3);
    }

    #[Test]
    public function it_can_show_a_single_user_list_item()
    {
        $item = UserListItem::factory()->create();

        $response = $this->getJson('/api/user-list-items/' . $item->id);

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $item->id,
                     'list_id' => $item->list_id,
                     'movie_id' => $item->movie_id,
                 ]);
    }

    #[Test]
    public function it_can_create_a_user_list_item()
    {
        $list = UserList::factory()->create();
        $movie = Movie::factory()->create();

        $data = [
            'list_id' => $list->id,
            'movie_id' => $movie->id_tmdb,
            'added_at' => now()->toDateTimeString(),
        ];

        $response = $this->postJson('/api/user-list-items', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment([
                     'list_id' => $list->id,
                     'movie_id' => $movie->id_tmdb,
                 ]);

        $this->assertDatabaseHas('user_list_items', $data);
    }

    #[Test]
    public function it_can_update_a_user_list_item()
    {
        $item = UserListItem::factory()->create();
        $newAddedAt = now()->addDay()->toDateTimeString();

        $response = $this->putJson('/api/user-list-items/' . $item->id, [
            'added_at' => $newAddedAt,
        ]);

        $response->assertStatus(200)
                 ->assertJsonFragment([
                     'id' => $item->id,
                     'added_at' => $newAddedAt,
                 ]);

        $this->assertDatabaseHas('user_list_items', [
            'id' => $item->id,
            'added_at' => $newAddedAt,
        ]);
    }

    #[Test]
    public function it_can_delete_a_user_list_item()
    {
        $item = UserListItem::factory()->create();

        $response = $this->deleteJson('/api/user-list-items/' . $item->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('user_list_items', ['id' => $item->id]);
    }
}