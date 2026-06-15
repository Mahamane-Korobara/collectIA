<?php

return [
    /*
     * Origines autorisées : le front Next.js (Vercel) et le dev local.
     * En prod : CORS_ALLOWED_ORIGINS=https://collectia.sahelstack.tech
     */
    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_filter(array_map(
        'trim',
        explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000'))
    ))),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
