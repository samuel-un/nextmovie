<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
		Schema::create('user_list_items', function (Blueprint $table) {
			$table->bigIncrements('id');
			$table->unsignedBigInteger('list_id');
			$table->unsignedBigInteger('movie_id');
			$table->timestamp('added_at')->nullable();
			$table->timestamps();
		
			$table->foreign('list_id')->references('id')->on('user_lists')->onDelete('cascade');
			$table->foreign('movie_id')->references('id_tmdb')->on('movies')->onDelete('cascade');
		});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_list_items');
    }
};