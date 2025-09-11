<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('bom-record');
})->name('bom-record');

Route::middleware(['auth'])->group(function () {
});
require __DIR__ . '/auth.php';
