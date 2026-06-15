<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ScopesToWorkspace;
use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\StoreNoteRequest;
use App\Http\Requests\Submission\UpdateStatusRequest;
use App\Models\Submission;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    use ScopesToWorkspace;

    public function index(Request $request): JsonResponse
    {
        $submissions = Submission::forWorkspace($this->workspaceId($request))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->input('status')))
            ->with('profile:id,slug')
            ->latest()
            ->paginate(20);

        return response()->json($submissions);
    }

    public function show(Request $request, Submission $submission): JsonResponse
    {
        $this->ensureInWorkspace($request, $submission);
        $submission->load(['notes.author:id,name', 'events', 'profile:id,slug']);

        return response()->json(['data' => $submission]);
    }

    public function updateStatus(UpdateStatusRequest $request, Submission $submission): JsonResponse
    {
        $this->ensureInWorkspace($request, $submission);

        $from = $submission->status;
        $submission->update(['status' => $request->input('status')]);

        $submission->events()->create([
            'user_id' => $request->user()->id,
            'type' => 'status_changed',
            'meta' => ['from' => $from, 'to' => $submission->status],
        ]);

        return response()->json(['data' => $submission]);
    }

    public function storeNote(StoreNoteRequest $request, Submission $submission): JsonResponse
    {
        $this->ensureInWorkspace($request, $submission);

        $note = $submission->notes()->create([
            'user_id' => $request->user()->id,
            'body' => $request->input('body'),
        ]);

        $submission->events()->create([
            'user_id' => $request->user()->id,
            'type' => 'note_added',
            'meta' => ['note_id' => $note->id],
        ]);

        return response()->json(['data' => $note->load('author:id,name')], 201);
    }
}
