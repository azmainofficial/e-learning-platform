<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Student/Projects/Index', [
            'projects' => Auth::user()->projects()->withCount('tasks')->latest()->get()
        ]);
    }

    public function show(Project $project)
    {
        // Check if student is part of the project
        if (!$project->users()->where('user_id', Auth::id())->exists()) {
            abort(403);
        }

        return Inertia::render('Student/Projects/Show', [
            'project' => $project->load(['tasks.assignee', 'tasks.comments.user', 'tasks.attachments.user', 'users'])
        ]);
    }
}
