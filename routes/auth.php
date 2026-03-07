<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    // Public registration disabled as per requirements
    // Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    // Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    // Admin-only User Management & Course Building
    Route::middleware(['role:admin,super_admin'])->group(function () {
        Route::resource('users', \App\Http\Controllers\Admin\UserController::class)->names([
            'index' => 'admin.users.index',
            'store' => 'admin.users.store',
            'update' => 'admin.users.update',
            'destroy' => 'admin.users.destroy',
        ]);

        // Courses
        Route::resource('courses', \App\Http\Controllers\Admin\CourseController::class)->names([
            'index' => 'admin.courses.index',
            'create' => 'admin.courses.create',
            'store' => 'admin.courses.store',
            'edit' => 'admin.courses.edit',
            'update' => 'admin.courses.update',
            'destroy' => 'admin.courses.destroy',
        ]);
        Route::post('courses/{course}/builder', [\App\Http\Controllers\Admin\CourseController::class, 'saveBuilder'])->name('admin.courses.builder.save');

        // Batches
        Route::resource('batches', \App\Http\Controllers\Admin\BatchController::class)->names([
            'index' => 'admin.batches.index',
            'store' => 'admin.batches.store',
            'update' => 'admin.batches.update',
            'destroy' => 'admin.batches.destroy',
        ]);
        Route::post('batches/{batch}/assign', [\App\Http\Controllers\Admin\BatchController::class, 'assignStudents'])->name('admin.batches.assign');

        // Assignments
        Route::resource('assignments', \App\Http\Controllers\Admin\AssignmentController::class)->only(['index', 'store', 'destroy'])->names([
            'index' => 'admin.assignments.index',
            'store' => 'admin.assignments.store',
            'destroy' => 'admin.assignments.destroy',
        ]);

        // Quizzes (Admin)
        Route::resource('quizzes', \App\Http\Controllers\Admin\QuizController::class)->names([
            'index' => 'admin.quizzes.index',
            'store' => 'admin.quizzes.store',
            'show' => 'admin.quizzes.show',
            'update' => 'admin.quizzes.update',
            'destroy' => 'admin.quizzes.destroy',
        ]);
        Route::post('quizzes/{quiz}/questions/sync', [\App\Http\Controllers\Admin\QuizController::class, 'syncQuestions'])->name('admin.quizzes.questions.sync');

        // Projects (Admin)
        Route::resource('projects', \App\Http\Controllers\Admin\ProjectController::class)->names([
            'index' => 'admin.projects.index',
            'store' => 'admin.projects.store',
            'show' => 'admin.projects.show',
            'update' => 'admin.projects.update',
            'destroy' => 'admin.projects.destroy',
        ]);
    });

    // Student-only Routes
    Route::middleware(['role:student'])->group(function () {
        Route::get('my-courses', [\App\Http\Controllers\Student\CourseController::class, 'index'])->name('student.courses.index');
        Route::get('my-courses/{course}', [\App\Http\Controllers\Student\CourseController::class, 'show'])->name('student.courses.show');
        Route::post('content/{content}/complete', [\App\Http\Controllers\Student\CourseController::class, 'completeContent'])->name('student.content.complete');
        Route::get('video-shield/{content}', [\App\Http\Controllers\Student\ShieldController::class, 'getSecureId'])->name('student.video.shield');
        Route::get('pdf-shield/{content}', [\App\Http\Controllers\Student\ShieldController::class, 'streamPdf'])->name('student.pdf.shield');

        // Quizzes (Student)
        Route::get('my-quizzes/{quiz}/{content}', [\App\Http\Controllers\Student\QuizController::class, 'show'])->name('student.quizzes.show');
        Route::post('my-quizzes/{quiz}/attempt', [\App\Http\Controllers\Student\QuizController::class, 'startAttempt'])->name('student.quizzes.attempt.start');
        Route::post('my-quizzes/attempt/{attempt}/submit/{content}', [\App\Http\Controllers\Student\QuizController::class, 'submitAttempt'])->name('student.quizzes.attempt.submit');

        // Projects (Student)
        Route::get('my-projects', [\App\Http\Controllers\Student\ProjectController::class, 'index'])->name('student.projects.index');
        Route::get('my-projects/{project}', [\App\Http\Controllers\Student\ProjectController::class, 'show'])->name('student.projects.show');
    });

    // Shared Project/Task Routes
    Route::middleware(['auth'])->group(function () {
        Route::post('projects/{project}/tasks', [\App\Http\Controllers\TaskController::class, 'store'])->name('tasks.store');
        Route::patch('tasks/{task}/status', [\App\Http\Controllers\TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
        Route::put('tasks/{task}', [\App\Http\Controllers\TaskController::class, 'update'])->name('tasks.update');
        Route::delete('tasks/{task}', [\App\Http\Controllers\TaskController::class, 'destroy'])->name('tasks.destroy');

        // Task Comments
        Route::post('tasks/{task}/comments', [\App\Http\Controllers\TaskCommentController::class, 'store'])->name('tasks.comments.store');
        Route::delete('comments/{comment}', [\App\Http\Controllers\TaskCommentController::class, 'destroy'])->name('tasks.comments.destroy');

        // Task Attachments
        Route::post('tasks/{task}/attachments', [\App\Http\Controllers\TaskAttachmentController::class, 'store'])->name('tasks.attachments.store');
        Route::delete('attachments/{attachment}', [\App\Http\Controllers\TaskAttachmentController::class, 'destroy'])->name('tasks.attachments.destroy');
    });
});
