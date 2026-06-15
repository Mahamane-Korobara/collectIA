<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\SendMagicLinkRequest;
use App\Http\Requests\Auth\VerifyMagicLinkRequest;
use App\Models\User;
use App\Notifications\MagicLoginLink;
use App\Services\MagicLinkService;
use App\Services\WorkspaceProvisioner;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function __construct(private WorkspaceProvisioner $provisioner) {}

    // --- Lien magique (e-mail uniquement) ---

    public function sendMagicLink(SendMagicLinkRequest $request, MagicLinkService $magic): JsonResponse
    {
        $email = $request->input('email');
        $raw = $magic->issue($email);

        $url = rtrim(config('app.frontend_url'), '/')
            .'/auth/magic?token='.$raw.'&email='.urlencode($email);

        Notification::route('mail', $email)->notify(new MagicLoginLink($url));

        return response()->json([
            'message' => 'Si cette adresse est valide, un lien de connexion vient de vous être envoyé.',
        ]);
    }

    public function verifyMagicLink(VerifyMagicLinkRequest $request, MagicLinkService $magic): JsonResponse
    {
        $email = $request->input('email');

        if (! $magic->consume($request->input('token'), $email)) {
            throw ValidationException::withMessages([
                'token' => ['Ce lien est invalide ou a expiré.'],
            ]);
        }

        $user = $this->resolveUser($email, name: Str::before($email, '@'));

        return response()->json([
            'token' => $user->createToken($request->input('device_name', 'web'))->plainTextToken,
            'user' => $this->userPayload($user),
        ]);
    }

    // --- Google OAuth ---

    public function googleRedirect(): JsonResponse
    {
        $url = Socialite::driver('google')->stateless()->redirect()->getTargetUrl();

        return response()->json(['url' => $url]);
    }

    public function googleCallback(): RedirectResponse
    {
        $front = rtrim(config('app.frontend_url'), '/').'/auth/google';

        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
        } catch (\Throwable $e) {
            return redirect()->away($front.'?error=google');
        }

        $user = $this->resolveUser(
            email: strtolower($googleUser->getEmail()),
            name: $googleUser->getName() ?: Str::before($googleUser->getEmail(), '@'),
            provider: 'google',
            providerId: $googleUser->getId(),
            avatar: $googleUser->getAvatar(),
        );

        $token = $user->createToken('google')->plainTextToken;

        return redirect()->away($front.'?token='.$token);
    }

    // --- Session ---

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté.']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    // --- Helpers ---

    private function resolveUser(
        string $email,
        string $name,
        ?string $provider = null,
        ?string $providerId = null,
        ?string $avatar = null,
    ): User {
        $user = User::firstOrNew(['email' => $email]);

        if (! $user->exists) {
            $user->name = $name;
        }

        $user->email_verified_at ??= now();

        if ($provider) {
            $user->provider = $provider;
            $user->provider_id = $providerId;
            $user->avatar = $avatar;
        }

        $user->save();

        if (! $user->current_workspace_id) {
            $this->provisioner->createPersonalWorkspace($user);
        }

        return $user->fresh();
    }

    private function userPayload(User $user): array
    {
        $user->loadMissing('currentWorkspace');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
            'current_workspace' => $user->currentWorkspace ? [
                'id' => $user->currentWorkspace->id,
                'name' => $user->currentWorkspace->name,
                'personal' => $user->currentWorkspace->personal,
            ] : null,
        ];
    }
}
