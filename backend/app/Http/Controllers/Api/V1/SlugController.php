<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ReservedSlug;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SlugController extends Controller
{
    /**
     * Vérifie en direct la disponibilité d'un slug (UX d'inscription).
     */
    public function check(Request $request): JsonResponse
    {
        $slug = strtolower(trim((string) $request->query('slug', '')));

        if (! preg_match('/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/', $slug)) {
            return response()->json(['available' => false, 'reason' => 'format']);
        }

        if (ReservedSlug::isReserved($slug)) {
            return response()->json(['available' => false, 'reason' => 'reserved']);
        }

        if (Profile::where('slug', $slug)->exists()) {
            return response()->json(['available' => false, 'reason' => 'taken']);
        }

        return response()->json(['available' => true]);
    }
}
