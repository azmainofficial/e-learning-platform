<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('instructor')->nullable()->after('level');
            $table->string('instructor_title')->nullable()->after('instructor');
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->text('description')->nullable()->after('title');
        });

        Schema::table('contents', function (Blueprint $table) {
            $table->integer('xp')->default(100)->after('order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['instructor', 'instructor_title']);
        });

        Schema::table('modules', function (Blueprint $table) {
            $table->dropColumn('description');
        });

        Schema::table('contents', function (Blueprint $table) {
            $table->dropColumn('xp');
        });
    }
};
