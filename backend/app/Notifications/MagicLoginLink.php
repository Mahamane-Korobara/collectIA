<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MagicLoginLink extends Notification
{
    public function __construct(public string $url) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $ttl = config('services.magic_link.ttl');

        return (new MailMessage)
            ->subject('Votre lien de connexion CollectIA')
            ->greeting('Bonjour,')
            ->line('Cliquez sur le bouton ci-dessous pour vous connecter à CollectIA.')
            ->action('Se connecter', $this->url)
            ->line("Ce lien expire dans {$ttl} minutes.")
            ->line("Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.");
    }
}
