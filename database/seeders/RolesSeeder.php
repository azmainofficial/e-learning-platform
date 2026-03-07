<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'student@mytrixit.com'],
            [
                'name' => 'Test Student',
                'password' => Hash::make('password'),
                'role' => 'student',
                'is_approved' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'admin@mytrixit.com'],
            [
                'name' => 'Test Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_approved' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'superadmin@mytrixit.com'],
            [
                'name' => 'Test Super Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
                'is_approved' => true,
            ]
        );
    }
}
