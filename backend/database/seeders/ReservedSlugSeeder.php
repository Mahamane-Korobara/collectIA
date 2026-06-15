<?php

namespace Database\Seeders;

use App\Models\ReservedSlug;
use Illuminate\Database\Seeder;

class ReservedSlugSeeder extends Seeder
{
    /**
     * Mots réservés interdits à l'inscription : ils entreraient en collision
     * avec les routes système servies à la racine (voir CDC §11.1).
     */
    public const SLUGS = [
        'app', 'api', 'auth', 'oauth', 'login', 'register', 'logout',
        'dashboard', 'settings', 'admin', 'pricing', 'about', 'help',
        'contact', 'support', 'blog', 'docs', 'status', 'webhooks',
        'assets', 'static', '_next', 'sitemap', 'robots', 'favicon',
        'f', 'r', 'u', 'www', 'mail', 'ws', 'cdn', 'collectia',
    ];

    public function run(): void
    {
        foreach (self::SLUGS as $slug) {
            ReservedSlug::firstOrCreate(['slug' => $slug]);
        }
    }
}
