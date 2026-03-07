<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::withCount(['tasks', 'users'])->latest()->get(),
            'students' => User::where('role', 'student')->get(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project = Project::create($validated);
        $project->users()->sync($request->user_ids);

        return back()->with('message', 'Project created.');
    }

    public function show(Project $project)
    {
        return Inertia::render('Admin/Projects/Show', [
            'project' => $project->load(['tasks.assignee', 'tasks.comments.user', 'tasks.attachments.user', 'users']),
            'students' => $project->users // Only show team members for task assignment
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:active,completed,archived',
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id'
        ]);

        $project->update($validated);
        $project->users()->sync($request->user_ids);

        return back()->with('message', 'Project updated.');
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return back()->with('message', 'Project deleted.');
    }
}
