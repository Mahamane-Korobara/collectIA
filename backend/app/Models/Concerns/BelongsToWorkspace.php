<?php

namespace App\Models\Concerns;

use App\Models\Workspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Rattache un modèle à un workspace (tenant). Toute donnée métier en porte un.
 * Les contrôleurs filtrent explicitement par le workspace courant via forWorkspace().
 */
trait BelongsToWorkspace
{
    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function scopeForWorkspace(Builder $query, int $workspaceId): Builder
    {
        return $query->where($this->getTable().'.workspace_id', $workspaceId);
    }
}
