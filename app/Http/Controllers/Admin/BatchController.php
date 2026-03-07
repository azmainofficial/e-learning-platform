<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Batch;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BatchController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Batches/Index', [
            'batches' => Batch::withCount('users')->get(),
            'students' => User::where('role', 'student')->where('is_approved', true)->get(['id', 'name', 'email'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        Batch::create($validated);

        return back()->with('message', 'Batch created.');
    }

    public function update(Request $request, Batch $batch)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $batch->update($validated);

        return back()->with('message', 'Batch updated.');
    }

    public function destroy(Batch $batch)
    {
        $batch->delete();
        return back()->with('message', 'Batch deleted.');
    }

    public function assignStudents(Request $request, Batch $batch)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $batch->users()->sync($request->user_ids);

        return back()->with('message', 'Students assigned to batch.');
    }
}
