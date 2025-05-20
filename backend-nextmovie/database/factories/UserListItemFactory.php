<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\UserList;
use App\Models\Movie;

class UserListItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'list_id' => UserList::factory(),
            'movie_id' => Movie::factory(),
            'added_at' => $this->faker->dateTime(),
        ];
    }
}