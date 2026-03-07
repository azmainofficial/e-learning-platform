<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Batch;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Assignments/Index', [
            'assignments' => Assignment::with(['course', 'batch', 'user'])->latest()->get(),
            'courses' => Course::where('status', 'active')->get(['id', 'title']),
            'batches' => Batch::get(['id', 'name']),
            'students' => User::where('role', 'student')->get(['id', 'name'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'type' => 'required|in:batch,individual',
            'batch_id' => 'required_if:type,batch|nullable|exists:batches,id',
            'user_id' => 'required_if:type,individual|nullable|exists:users,id',
            'due_at' => 'nullable|date',
        ]);

        Assignment::create($validated);

        return back()->with('message', 'Course assigned successfully.');
    }

    public function destroy(Assignment $assignment)
    {
        $assignment->delete();
        return back()->with('message', 'Assignment removed.');
    }
}
