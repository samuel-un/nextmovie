<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class MovieFactory extends Factory
{
    public function definition(): array
    {
        return [
            'id_tmdb' => $this->faker->unique()->numberBetween(10000, 99999),
            'title' => $this->faker->sentence(3),
            'type' => $this->faker->randomElement(['movie', 'series']),
            'poster_url' => $this->faker->imageUrl(),
            'release_date' => $this->faker->date(),
        ];
    }
}