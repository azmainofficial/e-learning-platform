<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class QuizController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Quizzes/Index', [
            'quizzes' => Quiz::withCount('questions')->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:0',
            'passing_score' => 'required|integer|min:0|max:100',
        ]);

        Quiz::create($validated);

        return back()->with('message', 'Quiz created.');
    }

    public function show(Quiz $quiz)
    {
        return Inertia::render('Admin/Quizzes/Builder', [
            'quiz' => $quiz->load('questions.options')
        ]);
    }

    public function update(Request $request, Quiz $quiz)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'time_limit' => 'required|integer|min:0',
            'passing_score' => 'required|integer|min:0|max:100',
        ]);

        $quiz->update($validated);

        return back()->with('message', 'Quiz updated.');
    }

    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return back()->with('message', 'Quiz deleted.');
    }

    public function syncQuestions(Request $request, Quiz $quiz)
    {
        $request->validate([
            'questions' => 'required|array',
            'questions.*.question_text' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.options.*.option_text' => 'required|string',
            'questions.*.options.*.is_correct' => 'required|boolean',
        ]);

        DB::transaction(function () use ($request, $quiz) {
            // Remove existing questions and options (simple sync)
            $quiz->questions()->delete();

            foreach ($request->questions as $index => $qData) {
                $question = $quiz->questions()->create([
                    'question_text' => $qData['question_text'],
                    'type' => $qData['type'] ?? 'multiple_choice',
                    'order' => $index
                ]);

                foreach ($qData['options'] as $oData) {
                    $question->options()->create([
                        'option_text' => $oData['option_text'],
                        'is_correct' => $oData['is_correct']
                    ]);
                }
            }
        });

        return back()->with('message', 'Quiz structure synced.');
    }
}
