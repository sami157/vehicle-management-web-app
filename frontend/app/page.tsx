'use client';

import { isAxiosError } from 'axios';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { type FormEvent, useState } from 'react';
import { api } from '@/config/api';
import { auth } from '@/config/firebase-init';

type AuthMeResponse = {
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    firebaseUid: string;
    avatarUrl: string | null;
  };
  firebase: {
    uid: string;
    email: string | null;
    name: string | null;
  };
};

function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'The backend could not verify this login.';
  }

  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = String((error as { code: unknown }).code);
    const messages: Record<string, string> = {
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/invalid-email': 'Enter a valid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/too-many-requests': 'Too many attempts. Try again later.',
    };

    if (messages[code]) {
      return messages[code];
    }
  }

  return error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState<AuthMeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const token = await credential.user.getIdToken();
      const response = await api.get<AuthMeResponse>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSession(response.data);
    } catch (requestError) {
      setSession(null);
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    setIsLoading(true);
    setError(null);

    try {
      await signOut(auth);
      setSession(null);
      setPassword('');
    } catch (signOutError) {
      setError(getErrorMessage(signOutError));
    } finally {
      setIsLoading(false);
    }
  }

  if (session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 text-slate-900">
        <section className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Fleet management</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">You are signed in</h1>
            <p className="mt-2 text-slate-600">Firebase and the backend accepted your credentials.</p>
          </div>

          <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-slate-500">Name</dt>
              <dd className="text-right text-sm font-medium">{session.user.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-slate-500">Email</dt>
              <dd className="text-right text-sm font-medium">{session.user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-slate-500">Role</dt>
              <dd className="text-right text-sm font-medium capitalize">{session.user.role}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-sm text-slate-500">Firebase UID</dt>
              <dd className="max-w-[65%] break-all text-right font-mono text-xs">{session.firebase.uid}</dd>
            </div>
          </dl>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            onClick={handleSignOut}
            type="button"
          >
            {isLoading ? 'Signing out…' : 'Sign out'}
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12 text-slate-900">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/70">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Fleet management</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Sign in</h1>
          <p className="mt-2 text-slate-600">Use a Firebase Email/Password test account.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
              type="password"
              value={password}
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}
