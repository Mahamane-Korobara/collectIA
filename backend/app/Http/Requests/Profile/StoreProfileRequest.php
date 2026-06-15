<?php

namespace App\Http\Requests\Profile;

use App\Rules\ValidSlug;
use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('slug')) {
            $this->merge(['slug' => strtolower(trim((string) $this->input('slug')))]);
        }
    }

    public function rules(): array
    {
        return [
            'slug' => ['required', 'string', new ValidSlug, 'unique:profiles,slug'],
            'config' => ['nullable', 'array'],
            'seo_meta' => ['nullable', 'array'],
            'published' => ['boolean'],
        ];
    }
}
