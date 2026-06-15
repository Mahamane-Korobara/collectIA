<?php

namespace App\Services;

use App\Models\User;
use App\Models\Workspace;

class WorkspaceProvisioner
{
    /**
     * Crée le workspace personnel d'un nouvel utilisateur, l'y rattache
     * comme owner et le définit comme workspace courant.
     */
    public function createPersonalWorkspace(User $user): Workspace
    {
        $workspace = Workspace::create([
            'owner_id' => $user->id,
            'name' => "Espace de {$user->name}",
            'personal' => true,
        ]);

        $workspace->members()->attach($user->id, ['role' => 'owner']);

        $user->forceFill(['current_workspace_id' => $workspace->id])->save();

        return $workspace;
    }
}
