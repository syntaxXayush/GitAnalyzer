'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Trash2, Sparkles, ShieldAlert, Activity } from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import ProfileHeader from '@/app/components/ProfileHeader';
import MetricsBentoGrid from '@/app/components/MetricsBentoGrid';
import LanguageDonutChart from '@/app/components/LanguageDonutChart';
import TopReposBarChart from '@/app/components/TopReposBarChart';
import ActivityAreaChart from '@/app/components/ActivityAreaChart';
import TopReposTable from '@/app/components/TopReposTable';
import { Skeleton } from '@/components/ui/LoadingSkeleton';
import { apiFetch } from '@/app/lib/api';
import { AnalyzedProfile, useAnalysisStore } from '@/app/stores/analysisStore';

type ProfileInsight = NonNullable<AnalyzedProfile['insights']>;

type DetailProfileResponse = {
    success: boolean;
    data: AnalyzedProfile;
};

interface Props {
    username: string;
}

export default function AnalyzedProfileDetails({ username }: Props) {
    const router = useRouter();
    const storeProfile = useAnalysisStore((state) => state.profile) as AnalyzedProfile | null;
    const setProfile = useAnalysisStore((state) => state.setProfile);
    const clearProfile = useAnalysisStore((state) => state.clearProfile);

    const [localProfile, setLocalProfile] = useState<AnalyzedProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await apiFetch<DetailProfileResponse>(`/api/v1/profiles/${username}`);
                if (!active) {
                    return;
                }
                setLocalProfile(response.data);
                setProfile(response.data);
            } catch (fetchError) {
                if (!active) {
                    return;
                }
                const message = fetchError instanceof Error ? fetchError.message : 'Unable to load profile';
                setError(message);
                toast.error('Failed to load profile', { description: message });
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void load();

        return () => {
            active = false;
        };
    }, [username, setProfile]);

    const activeProfile = useMemo(() => {
        if (storeProfile?.username === username) {
            return storeProfile;
        }

        return localProfile;
    }, [localProfile, storeProfile, username]);

    const insights = activeProfile?.insights;
    const activitySummary = activeProfile?.activitySummary;

    const handleDelete = async () => {
        const confirmed = window.confirm(`Delete the stored analysis for @${username}?`);
        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            await apiFetch(`/api/v1/profiles/${username}`, { method: 'DELETE' });
            clearProfile();
            toast.success(`Deleted @${username}`);
            router.push('/analyzed-profiles');
        } catch (deleteError) {
            const message = deleteError instanceof Error ? deleteError.message : 'Unable to delete profile';
            toast.error('Delete failed', { description: message });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <ToastProvider />
                <div className="min-h-screen px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto space-y-6">
                    <Skeleton className="h-40 rounded-2xl" />
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton key={`detail-skel-${index}`} className="h-28 rounded-xl" />
                        ))}
                    </div>
                    <Skeleton className="h-72 rounded-2xl" />
                    <Skeleton className="h-72 rounded-2xl" />
                </div>
            </AppLayout>
        );
    }

    if (error || !activeProfile) {
        return (
            <AppLayout>
                <ToastProvider />
                <div className="min-h-screen px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
                    <div className="card-elevated p-8 max-w-2xl mx-auto text-center space-y-4">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                            <AlertTriangle size={24} />
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground">Profile not available</h1>
                        <p className="text-sm text-muted-foreground">
                            {error ?? `No stored analysis was found for @${username}.`}
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push('/analyzed-profiles')}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            <ArrowLeft size={14} />
                            Back to profiles
                        </button>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const insight = (insights ?? {
        summary: '',
        strengths: [],
        opportunities: [],
        activitySignal: 'No insight available',
        riskFlags: [],
    }) as ProfileInsight;

    return (
        <AppLayout>
            <ToastProvider />
            <div className="min-h-screen px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">GitAnalyzer</span>
                            <span className="text-muted-foreground opacity-40">·</span>
                            <span className="text-2xs font-semibold uppercase tracking-widest text-primary font-mono">Stored profile</span>
                        </div>
                        <h1 className="text-2xl font-semibold text-foreground tracking-tight">@{username}</h1>
                        <p className="text-sm text-muted-foreground mt-1">A persisted GitHub intelligence snapshot with live refresh and deletion controls.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => router.push('/analyzed-profiles')}
                            className="inline-flex items-center gap-2 rounded-lg border border-border bg-muted px-4 py-2 text-sm font-semibold text-foreground"
                        >
                            <ArrowLeft size={14} />
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
                        >
                            <Trash2 size={14} />
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <div className="card-elevated p-6 lg:col-span-2">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                                <Sparkles size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Developer intelligence summary</h2>
                                <p className="text-sm text-muted-foreground">Why this profile scored the way it did.</p>
                            </div>
                        </div>
                        <p className="text-sm text-secondary-foreground leading-6">{insight.summary || `Stored analysis for @${username}.`}</p>
                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <div className="text-2xs uppercase tracking-[0.2em] text-muted-foreground">Activity signal</div>
                                <div className="mt-2 text-sm font-semibold text-foreground">{insight.activitySignal}</div>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <div className="text-2xs uppercase tracking-[0.2em] text-muted-foreground">Recent activity</div>
                                <div className="mt-2 text-sm font-semibold text-foreground">
                                    {activitySummary?.recentActivityScore ?? 0}
                                </div>
                            </div>
                            <div className="rounded-xl border border-border bg-muted/30 p-4">
                                <div className="text-2xs uppercase tracking-[0.2em] text-muted-foreground">Events scanned</div>
                                <div className="mt-2 text-sm font-semibold text-foreground">
                                    {activitySummary?.eventsScanned ?? 0}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card-elevated p-6">
                        <div className="flex items-center gap-2 mb-3 text-foreground">
                            <ShieldAlert size={16} className="text-warning" />
                            <h3 className="text-sm font-semibold">Strengths</h3>
                        </div>
                        <ul className="space-y-2 text-sm text-secondary-foreground">
                            {(insight.strengths.length > 0 ? insight.strengths : ['No strengths recorded']).map((item) => (
                                <li key={item} className="rounded-lg bg-muted/40 px-3 py-2">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="card-elevated p-6">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Opportunities</h3>
                        <ul className="space-y-2 text-sm text-secondary-foreground">
                            {(insight.opportunities.length > 0 ? insight.opportunities : ['No opportunities recorded']).map((item) => (
                                <li key={item} className="rounded-lg border border-border bg-muted/30 px-3 py-2">{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="card-elevated p-6">
                        <h3 className="mb-3 text-sm font-semibold text-foreground">Risk flags</h3>
                        <ul className="space-y-2 text-sm text-secondary-foreground">
                            {(insight.riskFlags.length > 0 ? insight.riskFlags : ['No major risks detected']).map((item) => (
                                <li key={item} className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <ProfileHeader profile={activeProfile} />
                <MetricsBentoGrid profile={activeProfile} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <LanguageDonutChart languages={activeProfile.languages} />
                    <div className="lg:col-span-2">
                        <TopReposBarChart repos={activeProfile.topRepos} />
                    </div>
                </div>

                <ActivityAreaChart data={activeProfile.activityData} />
                <TopReposTable repos={activeProfile.topRepos} />
            </div>
        </AppLayout>
    );
}