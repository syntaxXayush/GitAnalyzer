'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const LANG_COLORS = [
    '#6EE7B7',
    '#818CF8',
    '#FCD34D',
    '#F87171',
    '#34D399',
    '#64748B',
];

interface Props {
    languages: { id: string; name: string; count: number; pct: number }[];
}

interface TooltipPayload {
    name: string;
    value: number;
    payload: { pct: number };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
    if (!active || !payload?.length) return null;
    const d = payload[0];
    return (
        <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl">
            <p className="text-xs font-semibold text-foreground">{d.name}</p>
            <p className="text-xs text-muted-foreground">
                {d.value} repos · {d.payload.pct}%
            </p>
        </div>
    );
}

export default function LanguageDonutChartInner({ languages }: Props) {
    return (
        <>
            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie
                        data={languages}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={3}
                        strokeWidth={0}
                    >
                        {languages.map((entry, i) => (
                            <Cell key={entry.id} fill={LANG_COLORS[i % LANG_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="space-y-1.5 mt-2">
                {languages.map((lang, i) => (
                    <div key={lang.id} className="flex items-center gap-2">
                        <span
                            className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: LANG_COLORS[i % LANG_COLORS.length] }}
                        />
                        <span className="text-xs text-foreground flex-1 truncate">{lang.name}</span>
                        <span className="text-xs tabular-nums text-muted-foreground">{lang.pct}%</span>
                    </div>
                ))}
            </div>
        </>
    );
}