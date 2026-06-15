<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Concerns\ScopesToWorkspace;
use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\StoreProfileRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ScopesToWorkspace;

    public function index(Request $request): JsonResponse
    {
        $profiles = Profile::forWorkspace($this->workspaceId($request))
            ->latest()
            ->get();

        return response()->json(['data' => $profiles]);
    }

    public function store(StoreProfileRequest $request): JsonResponse
    {
        $profile = Profile::create([
            ...$request->validated(),
            'workspace_id' => $this->workspaceId($request),
        ]);

        return response()->json(['data' => $profile], 201);
    }

    public function show(Request $request, Profile $profile): JsonResponse
    {
        $this->ensureInWorkspace($request, $profile);

        return response()->json(['data' => $profile]);
    }

    public function update(UpdateProfileRequest $request, Profile $profile): JsonResponse
    {
        $this->ensureInWorkspace($request, $profile);
        $profile->update($request->validated());

        return response()->json(['data' => $profile]);
    }

    public function destroy(Request $request, Profile $profile): JsonResponse
    {
        $this->ensureInWorkspace($request, $profile);
        $profile->delete();

        return response()->json(['message' => 'Profil supprimé.']);
    }
}
