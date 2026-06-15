<?php

namespace App\Http\Requests\Submission;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Statuts du suivi minimal V1 (le pipeline complet arrive en V4).
        return [
            'status' => ['required', 'string', Rule::in(['nouveau', 'repondu', 'archive'])],
        ];
    }
}
