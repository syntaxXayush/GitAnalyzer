'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, RefreshCcw, ArrowUpDown, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { apiFetch } from '@/app/lib/api';
import { toast } from 'sonner';
import AppImage from '@/components/ui/AppImage';

type ProfileListItem = {
    username: string;
    name: string;
    avatarUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    score: number;
    level: string;
    topLanguage: string;
    avgStarsPerRepo: number;
    mostStarredRepoName: string;
    mostStarredRepoStars: number;
    accountAgeYears: number;
    analyzedAt: string;
};

type PagedProfiles = {
    items: ProfileListItem[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

type ProfilesResponse = {
    success: boolean;
    data: ProfileListItem[];
    meta: { page: number; limit: number; total: number; totalPages: number };
};

const SORT_OPTIONS = [
    { value: 'analyzedAt', label: 'Newest' },
    { value: 'score', label: 'Score' },
    { value: 'followers', label: 'Followers' },
    { value: 'publicRepos', label: 'Repos' },
    { value: 'totalStars', label: 'Stars' },
];

export default function AnalyzedProfiles() {
    const [data, setData] = useState<PagedProfiles>({
        items: [],
        meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    });
    const [query, setQuery] = useState('');
    const [level, setLevel] = useState('');
    const [sortBy, setSortBy] = useState('analyzedAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [loading, setLoading] = useState(false);

    const fetchProfiles = async (page = 1) => {
        setLoading(true);

        try {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(data.meta.limit),
                sortBy,
                sortOrder,
            });

            if (query.trim()) {
                params.set('q', query.trim());
            }

            if (level) {
                params.set('level', level);
            }

            const response = await apiFetch<ProfilesResponse>(`/api/v1/profiles?${params.toString()}`);
            setData({
                items: Array.isArray(response.data) ? response.data : [],
                meta: response.meta ?? { page: 1, limit: 10, total: 0, totalPages: 1 },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load analyzed profiles';
            toast.error('Failed to load profiles', { description: message });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchProfiles(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, sortOrder, level]);

    const pageNumbers = useMemo(() => {
        const totalPages = Math.max(1, data.meta.totalPages);
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }, [data.meta.totalPages]);

    return (
        <div className="space-y-6">
            <div className="card-elevated p-4 lg:p-5">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Search</span>
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            void fetchProfiles(1);
                                        }
                                    }}
                                    placeholder="Search username or name"
                                    className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                                />
                            </div>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Level</span>
                            <select
                                value={level}
                                onChange={(event) => setLevel(event.target.value)}
                                className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="">All levels</option>
                                <option value="Starter">Starter</option>
                                <option value="Emerging">Emerging</option>
                                <option value="Builder">Builder</option>
                                <option value="Senior">Senior</option>
                                <option value="Expert">Expert</option>
                                <option value="Legend">Legend</option>
                            </select>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-medium text-muted-foreground">Sort by</span>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(event) => setSortBy(event.target.value)}
                                    className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))}
                                    className="inline-flex items-center justify-center rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground"
                                >
                                    <ArrowUpDown size={14} />
                                </button>
                            </div>
                        </label>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => void fetchProfiles(1)}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            <RefreshCcw size={14} />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                <div className="card-elevated p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Stored analyses</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{data.meta.total}</div>
                </div>
                <div className="card-elevated p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current page</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{data.meta.page}</div>
                </div>
                <div className="card-elevated p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Top record</div>
                    <div className="mt-2 text-2xl font-semibold text-foreground">{data.items?.[0]?.score ?? 0}</div>
                </div>
            </div>

            <div className="card-elevated overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                            <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
                                <th className="px-4 py-3">Developer</th>
                                <th className="px-4 py-3">Level</th>
                                <th className="px-4 py-3">Repos</th>
                                <th className="px-4 py-3">Stars</th>
                                <th className="px-4 py-3">Followers</th>
                                <th className="px-4 py-3">Top language</th>
                                <th className="px-4 py-3">Score</th>
                                <th className="px-4 py-3">Last analyzed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading && data.items.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={8}>
                                        Loading analyzed profiles...
                                    </td>
                                </tr>
                            ) : data.items.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={8}>
                                        No analyzed profiles found.
                                    </td>
                                </tr>
                            ) : (
                                data.items.map((item) => (
                                    <tr key={item.username} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <AppImage src={item.avatarUrl} alt={item.username} width={40} height={40} className="h-10 w-10 rounded-full border border-border object-cover" unoptimized />
                                                <div>
                                                    <Link href={`/analyzed-profiles/${item.username}`} className="font-medium text-foreground hover:text-primary">
                                                        {item.name}
                                                    </Link>
                                                    <div className="text-xs text-muted-foreground">@{item.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-foreground">{item.level}</td>
                                        <td className="px-4 py-4 text-sm text-foreground">{item.publicRepos}</td>
                                        <td className="px-4 py-4 text-sm text-foreground">{item.totalStars}</td>
                                        <td className="px-4 py-4 text-sm text-foreground">{item.followers}</td>
                                        <td className="px-4 py-4 text-sm text-foreground">{item.topLanguage}</td>
                                        <td className="px-4 py-4 text-sm font-semibold text-foreground">{item.score}</td>
                                        <td className="px-4 py-4 text-sm text-muted-foreground">{new Date(item.analyzedAt).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">
                    Showing page {data.meta.page} of {data.meta.totalPages}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => void fetchProfiles(Math.max(1, data.meta.page - 1))}
                        disabled={data.meta.page <= 1 || loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground disabled:opacity-50"
                    >
                        <ChevronLeft size={14} />
                        Prev
                    </button>
                    {pageNumbers.slice(0, 6).map((page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => void fetchProfiles(page)}
                            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${page === data.meta.page ? 'bg-primary text-primary-foreground' : 'border border-border bg-muted text-foreground'}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => void fetchProfiles(Math.min(data.meta.totalPages, data.meta.page + 1))}
                        disabled={data.meta.page >= data.meta.totalPages || loading}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground disabled:opacity-50"
                    >
                        Next
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-foreground">
                <ShieldCheck size={16} className="text-emerald-500" />
                Profiles are sourced from the MySQL analysis store and refreshed through the GitHub REST API.
            </div>
        </div>
    );
}
