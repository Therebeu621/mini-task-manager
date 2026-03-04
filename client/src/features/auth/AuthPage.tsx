import { useMemo, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '../../components/ui/Button';
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
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-app-accent/[0.07] blur-3xl" />
                <div className="absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-violet-500/[0.05] blur-3xl" />
            </div>

            <div
                className="relative w-full max-w-[440px] rounded-xl border border-app-border bg-white/80 p-8 shadow-xl backdrop-blur-xl sm:p-10"
                aria-label="Authentification"
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-app-accent shadow-md">
                        <span className="text-lg font-black text-white">M</span>
                    </div>
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-app-accent">
                        Mini Task Manager
                    </p>
                    <h1 className="text-2xl font-bold tracking-tight text-app-text">{title}</h1>
                    <p className="mt-1.5 text-sm text-app-muted">
                        {mode === 'login'
                            ? 'Connectez-vous pour acceder a vos taches.'
                            : 'Inscrivez-vous pour commencer a organiser votre travail.'}
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg bg-app-surface-muted p-1 ring-1 ring-app-border">
                    <button
                        type="button"
                        onClick={() => setMode('login')}
                        aria-pressed={mode === 'login'}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                            mode === 'login'
                                ? 'bg-white text-app-text shadow-sm'
                                : 'text-app-muted hover:text-app-text'
                        }`}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        aria-pressed={mode === 'register'}
                        className={`rounded-md px-3 py-2 text-sm font-semibold transition-all ${
                            mode === 'register'
                                ? 'bg-white text-app-text shadow-sm'
                                : 'text-app-muted hover:text-app-text'
                        }`}
                    >
                        Register
                    </button>
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

                    {errorMessage && (
                        <div className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                            {errorMessage}
                        </div>
                    )}

                    <Button type="submit" disabled={isSubmitting} fullWidth className="mt-2 h-11">
                        {isSubmitting
                            ? 'Chargement...'
                            : mode === 'login'
                              ? 'Se connecter'
                              : 'Creer mon compte'}
                    </Button>
                </form>
            </div>
        </main>
    );
}
