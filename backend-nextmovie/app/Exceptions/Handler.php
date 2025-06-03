<?php

namespace App\Exceptions;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $levels = [];

    protected $dontReport = [];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

	public function unauthenticated($request, AuthenticationException $exception)
	{
		if ($request->expectsJson() || $request->is('api/*')) {
			return response()->json(['error' => 'No autenticado.'], 401);
		}

		return redirect()->guest(route('login'));
	}
}