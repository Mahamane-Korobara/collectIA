<?php

namespace App\Http\Requests\Profile;

use App\Rules\ValidSlug;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
        $profileId = $this->route('profile')?->id;

        return [
            'slug' => ['sometimes', 'required', 'string', new ValidSlug, Rule::unique('profiles', 'slug')->ignore($profileId)],
            'config' => ['nullable', 'array'],
            'seo_meta' => ['nullable', 'array'],
            'published' => ['boolean'],
        ];
    }
}
