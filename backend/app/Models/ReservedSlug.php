<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug'])]
class ReservedSlug extends Model
{
    /**
     * Vrai si le slug (normalisé) est réservé et donc interdit à l'inscription.
     */
    public static function isReserved(string $slug): bool
    {
        return static::where('slug', strtolower(trim($slug)))->exists();
    }
}
