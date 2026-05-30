'use client';

import React from 'react';

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    return (
        <html lang="en">
            <body>
                <div className="min-h-screen flex items-center justify-center bg-background px-6">
                    <div className="max-w-lg w-full rounded-2xl border border-border bg-card p-8 shadow-lg">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-3">
                            GitAnalyzer
                        </p>
                        <h1 className="text-2xl font-semibold text-foreground mb-3">
                            Application error
                        </h1>
                        <p className="text-sm text-muted-foreground mb-5 break-words">
                            {error.message || 'A fatal rendering error occurred.'}
                        </p>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            Reload application
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}