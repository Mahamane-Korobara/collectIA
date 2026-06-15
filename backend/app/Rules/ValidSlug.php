<?php

namespace App\Rules;

use App\Models\ReservedSlug;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * Valide un slug de profil public (CDC §11.1) :
 * - 3 à 30 caractères : minuscules, chiffres, tirets ;
 * - pas de tiret en début ni en fin ;
 * - pas dans la liste des mots réservés (collision avec les routes système).
 */
class ValidSlug implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || ! preg_match('/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/', $value)) {
            $fail('Le nom doit faire 3 à 30 caractères (minuscules, chiffres, tirets) sans tiret en début ou fin.');

            return;
        }

        if (ReservedSlug::isReserved($value)) {
            $fail('Ce nom est réservé et ne peut pas être utilisé.');
        }
    }
}
