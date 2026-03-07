<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Content;
use App\Models\UserProgress;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class CourseController extends Controller
{
    public function index()
    {
        $userId = Auth::id();
        $batchIds = Auth::user()->batches->pluck('id');

        // Get courses assigned to the student's batches or specifically to them
        $assignedCourseIds = Assignment::whereIn('batch_id', $batchIds)
            ->orWhere('user_id', $userId)
            ->pluck('course_id');

        $courses = Course::whereIn('id', $assignedCourseIds)
            ->where('status', 'active')
            ->withCount('modules')
            ->get();

        // Load progress for each course
        $courses->each(function ($course) {
            $totalContent = Content::whereIn('module_id', $course->modules->pluck('id'))->count();
            $completedContent = UserProgress::where('user_id', Auth::id())
                ->whereIn('content_id', Content::whereIn('module_id', $course->modules->pluck('id'))->pluck('id'))
                ->count();

            $course->progress_percentage = $totalContent > 0 ? round(($completedContent / $totalContent) * 100) : 0;
        });

        return Inertia::render('Student/Courses/Index', [
            'courses' => $courses
        ]);
    }

    public function show(Course $course)
    {
        $course->load(['modules.contents']);

        // Video Protection: Remove sensitive IDs from initial payload
        foreach ($course->modules as $module) {
            foreach ($module->contents as $content) {
                if ($content->type === 'video' || $content->type === 'pdf') {
                    $content->data = ['protected' => true];
                }
            }
        }

        $userProgress = UserProgress::where('user_id', Auth::id())
            ->whereIn('content_id', Content::whereIn('module_id', $course->modules->pluck('id'))->pluck('id'))
            ->pluck('content_id')
            ->toArray();

        // Sequential Check: Find the first uncompleted content
        $canAccessAll = false; // Set to true for testing if needed
        $nextToUnlock = null;
        $allContents = $course->modules->flatMap(function ($module) {
            return $module->contents;
        });

        foreach ($allContents as $content) {
            if (!in_array($content->id, $userProgress)) {
                $nextToUnlock = $content->id;
                break;
            }
        }

        return Inertia::render('Student/Courses/Show', [
            'course' => $course,
            'userProgress' => $userProgress,
            'nextToUnlock' => $nextToUnlock
        ]);
    }

    public function completeContent(Request $request, Content $content)
    {
        // Security: Prevent completing locked content
        $course = $content->module->course;
        $allContents = $course->modules->flatMap(fn($m) => $m->contents);

        $userProgress = UserProgress::where('user_id', Auth::id())
            ->whereIn('content_id', $allContents->pluck('id'))
            ->pluck('content_id')
            ->toArray();

        $canComplete = false;
        foreach ($allContents as $index => $c) {
            if ($c->id === $content->id) {
                if ($index === 0 || in_array($allContents[$index - 1]->id, $userProgress)) {
                    $canComplete = true;
                }
                break;
            }
        }

        if (!$canComplete) {
            return back()->with('error', 'You must complete previous topics first.');
        }

        UserProgress::updateOrCreate(
            ['user_id' => Auth::id(), 'content_id' => $content->id],
            ['completed_at' => now()]
        );

        return back()->with('message', 'Phase Complete!');
    }
}
