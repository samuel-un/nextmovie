<?php

return [
    'paths' => ['api/*', 'auth/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://nextmovie-xi.vercel.app'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
