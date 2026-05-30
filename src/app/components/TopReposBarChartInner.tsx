'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface Repo {
    id: string;
    name: string;
    stars: number;
    forks: number;
    language: string;
    pushedAt: string;
}

interface TooltipPayload {
    name: string;
    value: number;
    payload: Repo;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl">
            <p className="text-xs font-semibold text-foreground mb-1 font-mono">{d.name}</p>
            <p className="text-xs text-muted-foreground">
                ⭐ {d.stars.toLocaleString()} stars
            </p>
            <p className="text-xs text-muted-foreground">
                🍴 {d.forks} forks · {d.language}
            </p>
        </div>
    );
}

export default function TopReposBarChartInner({ repos }: { repos: Repo[] }) {
    return (
        <ResponsiveContainer width="100%" height={220}>
            <BarChart data={repos} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.4} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    angle={-30}
                    textAnchor="end"
                    height={48}
                />
                <YAxis
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--muted)', opacity: 0.4 }} />
                <Bar dataKey="stars" fill="url(#barGradient)" radius={[4, 4, 0, 0]}>
                    {repos.map((_, i) => (
                        <Cell key={`bar-cell-${i}`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}