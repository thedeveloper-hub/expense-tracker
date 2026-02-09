'use client';

import React, { useState } from 'react';
import { useAuth } from './AuthProvider';

export default function LoginForm() {
    const { signIn, signUp, signInWithGoogle, isConfigured } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isConfigured) {
        return (
            <div className="glass-card" style={{ padding: '2rem', maxWidth: '500px', margin: '2rem auto' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '700', textAlign: 'center' }}>
                    ⚙️ Setup Required
                </h2>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1rem' }}>
                    Supabase is not configured. The app will use localStorage for now.
                </p>
                <div style={{
                    padding: '1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <p style={{ marginBottom: '0.5rem' }}>To enable cloud storage:</p>
                    <ol style={{ marginLeft: '1.5rem' }}>
                        <li>Create a free account at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>supabase.com</a></li>
                        <li>Create a new project</li>
                        <li>Copy your project URL and anon key</li>
                        <li>Create a <code>.env.local</code> file with your credentials</li>
                    </ol>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = isSignUp
                ? await signUp(email, password)
                : await signIn(email, password);

            if (error) {
                setError(error.message);
            } else if (isSignUp) {
                setError('Check your email to confirm your account!');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card" style={{ padding: '2rem', maxWidth: '400px', margin: '2rem auto' }}>


            <button
                onClick={async () => {
                    setError('');
                    setLoading(true);
                    try {
                        const { error } = await signInWithGoogle();
                        if (error) setError(error.message);
                    } catch (err: any) {
                        setError(err.message || 'An error occurred');
                    } finally {
                        setLoading(false);
                    }
                }}
                className="btn"
                style={{
                    width: '100%',
                    background: 'white',
                    color: '#333',
                    border: '1px solid #ddd',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                }}
                disabled={loading}
            >
                <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    style={{ width: '20px', height: '20px' }}
                />
                Sign in with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', margin: '0 0 1.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                <span style={{ padding: '0 0.75rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="input"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {error && (
                    <div
                        style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            background: error.includes('Check your email') ? 'var(--success)' : 'var(--danger)',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            opacity: 0.9,
                        }}
                    >
                        {error}
                    </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                    {loading ? '⏳ Loading...' : isSignUp ? '✨ Create Account' : '🚀 Sign In'}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError('');
                    }}
                    className="btn btn-secondary btn-sm"
                >
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
            </div>
        </div >
    );
}
