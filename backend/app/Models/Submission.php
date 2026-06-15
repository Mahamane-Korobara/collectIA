<?php

namespace App\Models;

use App\Models\Concerns\BelongsToWorkspace;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['workspace_id', 'profile_id', 'name', 'email', 'phone', 'message', 'payload', 'status'])]
class Submission extends Model
{
    use BelongsToWorkspace;

    protected function casts(): array
    {
        return ['payload' => 'array'];
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function notes(): HasMany
    {
        return $this->hasMany(SubmissionNote::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(SubmissionEvent::class);
    }
}
