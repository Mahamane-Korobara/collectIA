<?php

namespace App\Services;

use App\Models\Profile;
use App\Models\ReservedSlug;
use Illuminate\Support\Str;

class SlugGenerator
{
    private const MAX = 30;

    /**
     * Génère un slug de profil professionnel et unique à partir d'un nom.
     * Ex. "Mahamane Korobara" -> "mahamane-korobara", puis "-2", "-3"… si pris.
     */
    public function uniqueProfileSlug(string $base): string
    {
        $slug = Str::slug($base);

        if (strlen($slug) < 3) {
            $slug = 'profil';
        }

        $slug = substr($slug, 0, self::MAX);
        $candidate = $slug;
        $i = 1;

        while ($this->taken($candidate)) {
            $i++;
            $suffix = '-'.$i;
            $candidate = substr($slug, 0, self::MAX - strlen($suffix)).$suffix;
        }

        return $candidate;
    }

    private function taken(string $slug): bool
    {
        return ReservedSlug::isReserved($slug)
            || Profile::where('slug', $slug)->exists();
    }
}
