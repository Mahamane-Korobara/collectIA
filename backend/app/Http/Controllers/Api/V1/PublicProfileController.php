<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Submission\PublicSubmissionRequest;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class PublicProfileController extends Controller
{
    /**
     * Lecture publique d'un profil (consommée en SSR par Next.js).
     * N'expose jamais les données internes du workspace.
     */
    public function show(string $slug): JsonResponse
    {
        $profile = Profile::where('slug', strtolower($slug))
            ->where('published', true)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'slug' => $profile->slug,
                'config' => $profile->config,
                'seo_meta' => $profile->seo_meta,
            ],
        ]);
    }

    /**
     * Réception d'une demande depuis le bloc contact public.
     */
    public function submit(PublicSubmissionRequest $request, string $slug): JsonResponse
    {
        $profile = Profile::where('slug', strtolower($slug))
            ->where('published', true)
            ->firstOrFail();

        $submission = $profile->submissions()->create([
            ...$request->validated(),
            'workspace_id' => $profile->workspace_id,
            'status' => 'nouveau',
        ]);

        $submission->events()->create([
            'type' => 'created',
            'meta' => ['source' => 'public_contact'],
        ]);

        // TODO V1.4 : déclencher Web Push + Reverb + e-mail (job asynchrone).
        // TODO V2 : déclencher le tri IA (job TriageSubmission).

        return response()->json([
            'message' => 'Votre message a bien été envoyé.',
            'id' => $submission->id,
        ], 201);
    }
}
