<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Content;
use App\Models\UserProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ShieldController extends Controller
{
    private function checkAccess(Content $content)
    {
        $course = $content->module->course;
        $allContents = $course->modules->flatMap(fn($m) => $m->contents);

        $userProgress = UserProgress::where('user_id', Auth::id())
            ->whereIn('content_id', $allContents->pluck('id'))
            ->pluck('content_id')
            ->toArray();

        foreach ($allContents as $index => $c) {
            if ($c->id === $content->id) {
                if ($index === 0 || in_array($allContents[$index - 1]->id, $userProgress)) {
                    return true;
                }
                break;
            }
        }
        return false;
    }

    public function getSecureId(Content $content)
    {
        if ($content->type !== 'video') {
            return response()->json(['error' => 'Invalid content type'], 403);
        }

        if (!$this->checkAccess($content)) {
            return response()->json(['error' => 'Content is locked'], 403);
        }

        $videoInput = $content->data['video_id'] ?? '';

        // Extract YouTube ID from URL if full URL was provided
        $videoId = $videoInput;
        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i', $videoInput, $matches)) {
            $videoId = $matches[1];
        }

        return response()->json([
            'token' => base64_encode($videoId)
        ]);
    }

    public function streamPdf(Content $content)
    {
        if ($content->type !== 'pdf') {
            abort(403);
        }

        if (!$this->checkAccess($content)) {
            abort(403);
        }

        $url = $content->data['url'] ?? '';

        // If it's an external URL, we can't really shield it from iframe iframes, 
        // but we can at least show it.
        if (filter_var($url, FILTER_VALIDATE_URL) && !str_contains($url, request()->getHttpHost())) {
            return redirect($url);
        }

        // Clean path to check storage
        $path = str_replace('/storage/', '', $url);
        // If it's still a full URL but internal, or some other variation
        $path = parse_url($path, PHP_URL_PATH);
        $path = ltrim($path, '/');

        if (Storage::disk('public')->exists($path)) {
            return response()->file(storage_path('app/public/' . $path), [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
                'X-Content-Type-Options' => 'nosniff',
            ]);
        }

        // Final fallback: just redirect to the URL if we can't find it locally
        if ($url) {
            return redirect($url);
        }

        abort(404);
    }
}
