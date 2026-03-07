<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\QuizResponse;
use App\Models\Content;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class QuizController extends Controller
{
    public function show(Quiz $quiz, Content $content)
    {
        // Get the latest attempt if exists
        $latestAttempt = QuizAttempt::where('user_id', Auth::id())
            ->where('quiz_id', $quiz->id)
            ->latest()
            ->first();

        return Inertia::render('Student/Quizzes/Show', [
            'quiz' => $quiz->load('questions.options'),
            'content' => $content->load('module'),
            'latestAttempt' => $latestAttempt
        ]);
    }

    public function startAttempt(Quiz $quiz)
    {
        $attempt = QuizAttempt::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quiz->id,
            'status' => 'in_progress',
            'started_at' => Carbon::now()
        ]);

        return back()->with('attempt_id', $attempt->id);
    }

    public function submitAttempt(Request $request, QuizAttempt $attempt, Content $content)
    {
        $quiz = $attempt->quiz->load('questions.options');
        $answers = $request->input('answers', []); // [question_id => option_id]

        $totalQuestions = $quiz->questions->count();
        $correctAnswers = 0;

        foreach ($quiz->questions as $question) {
            $submittedOptionId = $answers[$question->id] ?? null;

            // Record response
            if ($submittedOptionId) {
                QuizResponse::create([
                    'quiz_attempt_id' => $attempt->id,
                    'question_id' => $question->id,
                    'option_id' => $submittedOptionId
                ]);

                // Check if correct
                $correctOption = $question->options->where('is_correct', true)->first();
                if ($correctOption && $correctOption->id == $submittedOptionId) {
                    $correctAnswers++;
                }
            }
        }

        $score = ($totalQuestions > 0) ? ($correctAnswers / $totalQuestions) * 100 : 0;

        $attempt->update([
            'score' => $score,
            'status' => 'completed',
            'completed_at' => Carbon::now()
        ]);

        // If they passed, mark as complete
        if ($score >= $quiz->passing_score) {
            UserProgress::updateOrCreate(
                ['user_id' => Auth::id(), 'content_id' => $content->id],
                ['completed_at' => Carbon::now()]
            );
        }

        return redirect()->route('student.quizzes.show', [$quiz->id, $content->id])
            ->with([
                'message' => 'Quiz completed with score: ' . round($score, 2) . '%',
                'score' => $score,
                'correct_answers' => $correctAnswers,
                'total_questions' => $totalQuestions,
                'passed' => ($score >= $quiz->passing_score)
            ]);
    }
}
