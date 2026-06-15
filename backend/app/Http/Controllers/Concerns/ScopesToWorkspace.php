<?php

namespace App\Http\Controllers\Concerns;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

/**
 * Isolation multi-tenant : tout accès passe par le workspace courant de l'utilisateur.
 */
trait ScopesToWorkspace
{
    protected function workspaceId(Request $request): int
    {
        return (int) $request->user()->current_workspace_id;
    }

    /**
     * Refuse l'accès (403) si le modèle n'appartient pas au workspace courant.
     */
    protected function ensureInWorkspace(Request $request, Model $model): void
    {
        abort_unless(
            (int) $model->getAttribute('workspace_id') === $this->workspaceId($request),
            403,
            'Cette ressource n\'appartient pas à votre espace de travail.'
        );
    }
}
