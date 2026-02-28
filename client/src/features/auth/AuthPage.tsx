import { useMemo, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const authSchema = z.object({
    email: z.string().email('Email invalide').max(255).trim().toLowerCase(),
    password: z.string().min(8, 'Mot de passe: 8 caractères minimum').max(128),
});

type AuthMode = 'login' | 'register';

interface AuthPageProps {
    isSubmitting: boolean;
    errorMessage?: string | null;
    onLogin: (payload: { email: string; password: string }) => Promise<void>;
    onRegister: (payload: { email: string; password: string }) => Promise<void>;
}

export function AuthPage({ isSubmitting, errorMessage, onLogin, onRegister }: AuthPageProps) {
    const [mode, setMode] = useState<AuthMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

    const title = useMemo(
        () => (mode === 'login' ? 'Connexion à votre espace' : 'Créer un compte'),
        [mode],
    );

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const parsed = authSchema.safeParse({ email, password });

        if (!parsed.success) {
            const errors: { email?: string; password?: string } = {};
            for (const issue of parsed.error.issues) {
                const key = issue.path[0];
                if (key === 'email' || key === 'password') {
                    errors[key] = issue.message;
                }
            }
            setFieldErrors(errors);
            return;
        }

        setFieldErrors({});
        if (mode === 'login') {
            await onLogin(parsed.data);
            return;
        }
        await onRegister(parsed.data);
    }

    return (
        <main className="auth-shell">
            <section className="auth-card" aria-label="Authentification">
                <p className="auth-card__eyebrow">Mini Task Manager</p>
                <h1>{title}</h1>
                <p className="auth-card__subtitle">
                    {mode === 'login'
                        ? 'Connectez-vous pour accéder à vos tâches.'
                        : 'Inscrivez-vous pour commencer à organiser votre travail.'}
                </p>

                <div className="auth-card__switch">
                    <Button
                        variant={mode === 'login' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('login')}
                        aria-pressed={mode === 'login'}
                    >
                        Login
                    </Button>
                    <Button
                        variant={mode === 'register' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('register')}
                        aria-pressed={mode === 'register'}
                    >
                        Register
                    </Button>
                </div>

                <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
                    <Input
                        id="auth-email"
                        label="Email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        error={fieldErrors.email}
                    />
                    <Input
                        id="auth-password"
                        label="Mot de passe"
                        type="password"
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        placeholder="Minimum 8 caractères"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        error={fieldErrors.password}
                    />

                    {errorMessage && <p className="auth-card__error">{errorMessage}</p>}

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                            ? 'Chargement...'
                            : mode === 'login'
                              ? 'Se connecter'
                              : 'Créer mon compte'}
                    </Button>
                </form>
            </section>
        </main>
    );
}
