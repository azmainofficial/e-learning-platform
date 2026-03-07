<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $pendingUsers = [];

        if ($user->role === 'super_admin' || $user->role === 'admin') {
            $pendingUsers = \App\Models\User::where('is_approved', false)->latest()->get();
        }

        if ($user->role === 'super_admin') {
            return Inertia::render('SuperAdmin/Dashboard', [
                'pendingUsers' => $pendingUsers
            ]);
        }

        if ($user->role === 'admin') {
            return Inertia::render('Admin/Dashboard', [
                'pendingUsers' => $pendingUsers
            ]);
        }

        if ($user->role === 'student') {
            $batchIds = $user->batches->pluck('id');
            $assignedCourseIds = \App\Models\Assignment::whereIn('batch_id', $batchIds)
                ->orWhere('user_id', $user->id)
                ->pluck('course_id');

            $courses = \App\Models\Course::whereIn('id', $assignedCourseIds)
                ->where('status', 'active')
                ->with(['modules.contents'])
                ->get()
                ->map(function ($course) use ($user) {
                    $totalContent = $course->modules->flatMap->contents->count();
                    $completedContent = \App\Models\UserProgress::where('user_id', $user->id)
                        ->whereIn('content_id', $course->modules->flatMap->contents->pluck('id'))
                        ->count();

                    $course->progress_percentage = $totalContent > 0 ? round(($completedContent / $totalContent) * 100) : 0;
                    return $course;
                });

            $recentAttempts = \App\Models\QuizAttempt::where('user_id', $user->id)
                ->with('quiz')
                ->latest()
                ->take(5)
                ->get();

            $projectStats = [
                'total' => \App\Models\Project::count(), // Projects available
                'active_tasks' => \App\Models\Task::where('assigned_to', $user->id)
                    ->where('status', '!=', 'done')
                    ->count(),
            ];

            return Inertia::render('Student/Dashboard', [
                'courses' => $courses,
                'recentAttempts' => $recentAttempts,
                'projectStats' => $projectStats
            ]);
        }

        return Inertia::render('Dashboard');
    }

    public function approve(Request $request, \App\Models\User $user)
    {
        if ($request->user()->role !== 'super_admin' && $request->user()->role !== 'admin') {
            abort(403);
        }

        $user->update(['is_approved' => true]);

        return back()->with('message', 'User approved successfully.');
    }

    public function reject(Request $request, \App\Models\User $user)
    {
        if ($request->user()->role !== 'super_admin' && $request->user()->role !== 'admin') {
            abort(403);
        }

        $user->delete();

        return back()->with('message', 'User application rejected.');
    }
}
