<?php

namespace App\Services;

use App\Models\MagicLoginToken;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class MagicLinkService
{
    /**
     * Émet un token de connexion à usage unique et renvoie sa valeur brute
     * (seul le hash est stocké).
     */
    public function issue(string $email): string
    {
        $raw = Str::random(48);

        MagicLoginToken::create([
            'email' => $email,
            'token_hash' => hash('sha256', $raw),
            'expires_at' => Carbon::now()->addMinutes(config('services.magic_link.ttl')),
        ]);

        return $raw;
    }

    /**
     * Valide et consomme un token. Renvoie true si le couple token/e-mail
     * est valide, non expiré et non déjà utilisé.
     */
    public function consume(string $raw, string $email): bool
    {
        $token = MagicLoginToken::query()
            ->where('token_hash', hash('sha256', $raw))
            ->where('email', $email)
            ->whereNull('used_at')
            ->where('expires_at', '>', now())
            ->first();

        if (! $token) {
            return false;
        }

        $token->forceFill(['used_at' => now()])->save();

        return true;
    }
}
