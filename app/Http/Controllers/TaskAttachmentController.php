<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\TaskAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class TaskAttachmentController extends Controller
{
    public function store(Request $request, Task $task)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
        $file->move(public_path('uploads/attachments'), $filename);

        $task->attachments()->create([
            'user_id' => Auth::id(),
            'file_path' => '/uploads/attachments/' . $filename,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientMimeType(),
        ]);

        return back()->with('message', 'File attached!');
    }

    public function destroy(TaskAttachment $attachment)
    {
        if ($attachment->user_id !== Auth::id() && Auth::user()->role !== 'admin' && Auth::user()->role !== 'super_admin') {
            abort(403);
        }

        // Delete from public directory directly
        if (str_starts_with($attachment->file_path, '/uploads/')) {
            $path = public_path($attachment->file_path);
            if (file_exists($path) && is_file($path)) {
                @unlink($path);
            }
        }

        $attachment->delete();

        return back()->with('message', 'Attachment removed!');
    }
}
