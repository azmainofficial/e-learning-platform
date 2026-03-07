<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
    use HasFactory;

    protected $fillable = ['module_id', 'title', 'type', 'data', 'order', 'xp'];

    protected $casts = [
        'data' => 'array',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function userProgress()
    {
        return $this->hasMany(UserProgress::class);
    }
}
