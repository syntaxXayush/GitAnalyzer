'use client';
import React from 'react';
import Link from 'next/link';

const ENDPOINTS = [
    { method: 'POST', path: '/api/v1/profiles/analyze', description: 'Analyze a GitHub username and store the generated profile snapshot.' },
    { method: 'GET', path: '/api/v1/profiles', description: 'Retrieve stored analyses with pagination, filtering, and sorting.' },
    { method: 'GET', path: '/api/v1/profiles/:username', description: 'Fetch a single stored analysis by username.' },
    { method: 'PATCH', path: '/api/v1/profiles/:username/refresh', description: 'Refresh an existing profile from the GitHub REST API.' },
    { method: 'DELETE', path: '/api/v1/profiles/:username', description: 'Delete a stored analysis and its related repository rows.' },
];

export default function ApiDocumentation() {
    return (
        <div className="space-y-6">
            <div className="card-elevated p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground mb-2">Swagger/OpenAPI</p>
                <h2 className="text-xl font-semibold text-foreground mb-2">Production API reference</h2>
                <p className="text-sm text-muted-foreground max-w-2xl">
                    The Express backend exposes a documented REST API with validation, rate limiting, and MySQL persistence.
                    Open the live Swagger UI for request/response examples and schema details.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="http://localhost:4000/docs" target="_blank" className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                        Open Swagger UI
                    </Link>
                    <Link href="http://localhost:4000/api/v1/health" target="_blank" className="inline-flex items-center rounded-lg border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground">
                        Health check
                    </Link>
                </div>
            </div>

            <div className="grid gap-4">
                {ENDPOINTS.map((endpoint) => (
                    <div key={`${endpoint.method}-${endpoint.path}`} className="card-elevated p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">{endpoint.method}</span>
                                <code className="text-sm text-foreground">{endpoint.path}</code>
                            </div>
                            <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
