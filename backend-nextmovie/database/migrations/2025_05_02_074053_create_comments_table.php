<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('comments', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->unsignedBigInteger('user_id');
			$table->unsignedBigInteger('movie_id');
			$table->text('comment_text');
			$table->float('comment_rating')->nullable();
			$table->timestamp('commented_at')->nullable();
			$table->timestamps();

			$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
			$table->foreign('movie_id')->references('id_tmdb')->on('movies')->onDelete('cascade');
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('comments');
	}
};
