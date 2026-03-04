import { useMemo, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';

const authSchema = z.object({
    email: z.string().email('Email invalide').max(255).trim().toLowerCase(),
    password: z.string().min(8, 'Mot de passe: 8 caracteres minimum').max(128),
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
        () => (mode === 'login' ? 'Connexion a votre espace' : 'Creer un compte'),
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
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(15,122,108,0.2),transparent_38%)]" />

            <Card className="relative w-full max-w-md p-6 sm:p-8" aria-label="Authentification">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-app-accent">
                    Mini Task Manager
                </p>
                <h1 className="text-2xl font-bold tracking-tight text-app-text">{title}</h1>
                <p className="mb-6 mt-2 text-sm text-app-muted">
                    {mode === 'login'
                        ? 'Connectez-vous pour acceder a vos taches.'
                        : 'Inscrivez-vous pour commencer a organiser votre travail.'}
                </p>

                <div className="mb-5 grid grid-cols-2 rounded-md border border-app-border bg-app-surface-muted p-1">
                    <Button
                        variant={mode === 'login' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('login')}
                        aria-pressed={mode === 'login'}
                        className={mode === 'login' ? '' : 'border-transparent'}
                    >
                        Login
                    </Button>
                    <Button
                        variant={mode === 'register' ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setMode('register')}
                        aria-pressed={mode === 'register'}
                        className={mode === 'register' ? '' : 'border-transparent'}
                    >
                        Register
                    </Button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
                        placeholder="Minimum 8 caracteres"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        error={fieldErrors.password}
                    />

                    {errorMessage && <p className="text-sm font-medium text-rose-700">{errorMessage}</p>}

                    <Button type="submit" disabled={isSubmitting} fullWidth>
                        {isSubmitting
                            ? 'Chargement...'
                            : mode === 'login'
                              ? 'Se connecter'
                              : 'Creer mon compte'}
                    </Button>
                </form>
            </Card>
        </main>
    );
}
