<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Movie;

class RatingFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
			'movie_id' => Movie::factory(),
            'score' => $this->faker->numberBetween(1, 5),
            'rated_at' => $this->faker->dateTime(),
        ];
    }
}