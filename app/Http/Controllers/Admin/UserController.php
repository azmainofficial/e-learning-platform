<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Auth\Events\Registered;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::latest()
                ->select(['id', 'name', 'email', 'role', 'is_approved', 'created_at'])
                ->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => 'required|in:student,admin,super_admin',
            'is_approved' => 'boolean'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'is_approved' => $request->is_approved ?? ($request->role === 'student' ? false : true),
        ]);

        event(new Registered($user));

        return back()->with('message', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'role' => 'required|in:student,admin,super_admin',
            'is_approved' => 'boolean'
        ]);

        $user->update([
            'role' => $request->role,
            'is_approved' => $request->is_approved
        ]);

        return back()->with('message', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete yourself.');
        }

        $user->delete();
        return back()->with('message', 'User deleted successfully.');
    }
}
