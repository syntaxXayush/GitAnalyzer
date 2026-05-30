'use client';

import React, { useState } from 'react';
import { Star, GitFork, ArrowUpDown, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';

interface Repo {
    id: string;
    name: string;
    stars: number;
    forks: number;
    language: string;
    pushedAt: string;
}

const LANG_COLORS: Record<string, string> = {
    TypeScript: '#818CF8',
    Python: '#FCD34D',
    Go: '#6EE7B7',
    Rust: '#F87171',
    JavaScript: '#FB923C',
    Ruby: '#F43F5E',
    Java: '#60A5FA',
    Other: '#64748B',
};

type SortKey = 'name' | 'stars' | 'forks' | 'pushedAt';

export default function TopReposTable({ repos }: { repos: Repo[] }) {
    const [sortKey, setSortKey] = useState<SortKey>('stars');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('desc');
        }
    };

    const sorted = [...repos].sort((a, b) => {
        let av: string | number = a[sortKey];
        let bv: string | number = b[sortKey];
        if (typeof av === 'string' && typeof bv === 'string') {
            return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
        }
        return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

    function SortIcon({ col }: { col: SortKey }) {
        if (sortKey !== col) return <ArrowUpDown size={11} className="text-muted-foreground" />;
        return sortDir === 'asc' ? (
            <ChevronUp size={11} className="text-primary" />
        ) : (
            <ChevronDown size={11} className="text-primary" />
        );
    }

    return (
        <div className="card-elevated overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">All Repositories</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{repos.length} repositories sorted by stars</p>
            </div>
            <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-muted/30">
                            {(
                                [
                                    { key: 'name' as SortKey, label: 'Repository' },
                                    { key: 'stars' as SortKey, label: 'Stars' },
                                    { key: 'forks' as SortKey, label: 'Forks' },
                                    { key: 'pushedAt' as SortKey, label: 'Last Push' },
                                ] as { key: SortKey; label: string }[]
                            ).map((col) => (
                                <th
                                    key={`th-${col.key}`}
                                    className="px-4 py-2.5 text-left cursor-pointer select-none group"
                                    onClick={() => handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                        {col.label}
                                        <SortIcon col={col.key} />
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-2.5 text-left">
                                <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">Language</span>
                            </th>
                            <th className="px-4 py-2.5 text-left">
                                <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">Link</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((repo) => (
                            <tr
                                key={repo.id}
                                className="border-b border-border/50 hover:bg-muted/30 transition-colors duration-100 group"
                            >
                                <td className="px-4 py-3">
                                    <span className="text-sm font-mono font-medium text-foreground">{repo.name}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-sm tabular-nums text-warning">
                                        <Star size={12} />
                                        {repo.stars.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
                                        <GitFork size={12} />
                                        {repo.forks}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs font-mono text-muted-foreground">{repo.pushedAt}</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: LANG_COLORS[repo.language] ?? LANG_COLORS.Other }}
                                        />
                                        <span className="text-xs text-foreground">{repo.language}</span>
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <a
                                        href="#"
                                        className="p-1.5 rounded-md text-muted-foreground hover:text-accent hover:bg-accent/10 transition-all duration-150 inline-flex opacity-0 group-hover:opacity-100"
                                        aria-label={`View ${repo.name} on GitHub`}
                                    >
                                        <ExternalLink size={13} />
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}