'use client';

import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface DataPoint {
    id: string;
    month: string;
    commits: number;
    prs: number;
}

interface TooltipPayload {
    name: string;
    value: number;
    color: string;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayload[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2.5 shadow-xl">
            <p className="text-xs font-semibold text-foreground mb-1.5">{label}</p>
            {payload.map((p) => (
                <p key={`tip-${p.name}`} className="text-xs text-muted-foreground">
                    <span style={{ color: p.color }} className="font-semibold">{p.name}</span>: {p.value}
                </p>
            ))}
        </div>
    );
}

export default function ActivityAreaChartInner({ data }: { data: DataPoint[] }) {
    const reversed = [...data].reverse();
    return (
        <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={reversed} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                    <linearGradient id="commitGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="commits"
                    stroke="var(--primary)"
                    fill="url(#commitGrad)"
                    strokeWidth={2}
                    dot={false}
                    name="Commits"
                />
                <Area
                    type="monotone"
                    dataKey="prs"
                    stroke="var(--accent)"
                    fill="url(#prGrad)"
                    strokeWidth={2}
                    dot={false}
                    name="Pull Requests"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}