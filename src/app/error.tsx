'use client';

import React, { useEffect } from 'react';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-8 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-3">
                    GitAnalyzer
                </p>
                <h1 className="text-2xl font-semibold text-foreground mb-3">
                    Something broke while loading this page
                </h1>
                <p className="text-sm text-muted-foreground mb-5 break-words">
                    {error.message || 'An unexpected runtime error occurred.'}
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                        Try again
                    </button>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="rounded-lg border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground"
                    >
                        Reload
                    </button>
                </div>
            </div>
        </div>
    );
}