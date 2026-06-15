<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\PublicProfileController;
use App\Http\Controllers\Api\V1\SlugController;
use App\Http\Controllers\Api\V1\SubmissionController;
use Illuminate\Support\Facades\Route;

/*
 * Toutes les routes sont préfixées par /v1 (voir bootstrap/app.php : apiPrefix).
 * Base publique : https://api.collectia.sahelstack.tech/v1
 */

// --- Public (sans authentification) ---
// Auth passwordless : lien magique + Google OAuth
Route::post('auth/magic-link', [AuthController::class, 'sendMagicLink']);
Route::post('auth/magic-link/verify', [AuthController::class, 'verifyMagicLink']);
Route::get('auth/google/redirect', [AuthController::class, 'googleRedirect']);
Route::get('auth/google/callback', [AuthController::class, 'googleCallback']);

Route::get('slug-available', [SlugController::class, 'check']);
Route::get('slug-suggest', [SlugController::class, 'suggest']);
Route::get('public/profiles/{slug}', [PublicProfileController::class, 'show']);
Route::post('public/profiles/{slug}/submissions', [PublicProfileController::class, 'submit']);

// --- Authentifié (token Sanctum) ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);

    Route::apiResource('profiles', ProfileController::class);

    Route::get('submissions', [SubmissionController::class, 'index']);
    Route::get('submissions/{submission}', [SubmissionController::class, 'show']);
    Route::patch('submissions/{submission}/status', [SubmissionController::class, 'updateStatus']);
    Route::post('submissions/{submission}/notes', [SubmissionController::class, 'storeNote']);
});
