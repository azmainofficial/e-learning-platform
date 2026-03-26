<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Module;
use App\Models\Content;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Courses/Index', [
            'courses' => Course::withCount('modules')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Courses/Builder');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|string',
            'instructor' => 'nullable|string',
            'instructor_title' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/courses'), $filename);
            $validated['cover_image'] = '/uploads/courses/' . $filename;
        }

        Course::create($validated);

        return redirect()->route('admin.courses.index')->with('message', 'Course created successfully.');
    }

    public function show(Course $course)
    {
        return Inertia::render('Admin/Courses/Show', [
            'course' => $course->load([
                'modules.contents.userProgress' => function ($query) {
                    $query->where('user_id', auth()->id());
                }
            ]),
            'quizzes' => \App\Models\Quiz::select('id', 'title')->get()
        ]);
    }

    public function edit(Course $course)
    {
        return Inertia::render('Admin/Courses/Builder', [
            'course' => $course->load(['modules.contents']),
            'quizzes' => \App\Models\Quiz::select('id', 'title')->get()
        ]);
    }

    public function update(Request $request, Course $course)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'level' => 'nullable|string',
            'instructor' => 'nullable|string',
            'instructor_title' => 'nullable|string',
            'cover_image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover_image')) {
            if ($course->cover_image && str_starts_with($course->cover_image, '/uploads/')) {
                $oldPath = public_path($course->cover_image);
                if (file_exists($oldPath) && is_file($oldPath)) {
                    @unlink($oldPath);
                }
            }
            $file = $request->file('cover_image');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('uploads/courses'), $filename);
            $validated['cover_image'] = '/uploads/courses/' . $filename;
        }

        $course->update($validated);

        return back()->with('message', 'Course updated successfully.');
    }

    public function saveBuilder(Request $request, Course $course)
    {
        // Handle massive sync of modules and contents
        // This is a simplified version - in production, use a more robust sync or granular updates
        $data = $request->input('modules');

        $moduleIds = [];

        foreach ($data as $mIndex => $moduleData) {
            $moduleId = isset($moduleData['id']) ? $moduleData['id'] : null;

            if ($moduleId) {
                $module = $course->modules()->find($moduleId);
                if ($module) {
                    $module->update([
                        'title' => $moduleData['title'],
                        'description' => $moduleData['description'] ?? null,
                        'order' => $mIndex,
                    ]);
                }
            } else {
                $module = $course->modules()->create([
                    'title' => $moduleData['title'],
                    'description' => $moduleData['description'] ?? null,
                    'order' => $mIndex,
                    'status' => 'active'
                ]);
            }

            if (!$module)
                continue;

            $moduleIds[] = $module->id;
            $contentIds = [];

            foreach ($moduleData['contents'] as $cIndex => $contentData) {
                $contentId = isset($contentData['id']) ? $contentData['id'] : null;

                if ($contentId) {
                    $content = $module->contents()->find($contentId);
                    if ($content) {
                        $content->update([
                            'title' => $contentData['title'],
                            'type' => $contentData['type'],
                            'xp' => $contentData['xp'] ?? 100,
                            'data' => $contentData['data'],
                            'order' => $cIndex
                        ]);
                    }
                } else {
                    $content = $module->contents()->create([
                        'title' => $contentData['title'],
                        'type' => $contentData['type'],
                        'xp' => $contentData['xp'] ?? 100,
                        'data' => $contentData['data'],
                        'order' => $cIndex
                    ]);
                }

                if ($content) {
                    $contentIds[] = $content->id;
                }
            }
            // Delete removed contents
            $module->contents()->whereNotIn('id', $contentIds)->delete();
        }

        // Delete removed modules
        $course->modules()->whereNotIn('id', $moduleIds)->delete();

        return back()->with('message', 'Course structure saved.');
    }

    public function destroy(Course $course)
    {
        if ($course->cover_image && str_starts_with($course->cover_image, '/uploads/')) {
            $oldPath = public_path($course->cover_image);
            if (file_exists($oldPath) && is_file($oldPath)) {
                @unlink($oldPath);
            }
        }

        $course->delete();

        return back()->with('message', 'Course deleted successfully.');
    }
}
