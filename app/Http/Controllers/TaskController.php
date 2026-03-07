<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    public function store(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,review,done',
            'priority' => 'required|in:low,medium,high',
            'due_at' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $project->tasks()->create($validated);

        return back()->with('message', 'Task created.');
    }

    public function update(Request $request, Task $task)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in_progress,review,done',
            'priority' => 'required|in:low,medium,high',
            'due_at' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id'
        ]);

        $task->update($validated);

        return back()->with('message', 'Task updated.');
    }

    public function updateStatus(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:todo,in_progress,review,done'
        ]);

        $task->update(['status' => $request->status]);

        return back()->with('message', 'Task status updated.');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return back()->with('message', 'Task deleted.');
    }
}
