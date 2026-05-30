'use client';

import React from 'react';
import { useAnalysisStore } from '@/app/stores/analysisStore';
import MetricsBentoGrid from '@/app/components/MetricsBentoGrid';
import LanguageDonutChart from '@/app/components/LanguageDonutChart';
import TopReposBarChart from '@/app/components/TopReposBarChart';
import ActivityAreaChart from '@/app/components/ActivityAreaChart';
import TopReposTable from '@/app/components/TopReposTable';
import ProfileHeader from '@/app/components/ProfileHeader';
import { Skeleton } from '@/components/ui/LoadingSkeleton';

export default function AnalysisResults() {
    const { profile, isLoading } = useAnalysisStore();

    if (isLoading) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Profile header skeleton */}
                <div className="card-elevated p-6 flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-3 w-64" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="w-24 h-10 rounded-lg" />
                </div>
                {/* Bento grid skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {Array.from({ length: 6 })?.map((_, i) => (
                        <div key={`bento-skel-${i}`} className="card-elevated p-5 space-y-3">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-7 w-24" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                    ))}
                </div>
                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-64 rounded-lg" />
                    <div className="lg:col-span-2">
                        <Skeleton className="h-64 rounded-lg" />
                    </div>
                </div>
                <Skeleton className="h-72 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="card-elevated p-12 flex flex-col items-center text-center">
                <div className="p-4 rounded-2xl bg-muted mb-4">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-muted-foreground">
                        <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" />
                        <path d="M20 12v8l5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">No analysis yet</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                    Enter a GitHub username above and click <span className="text-primary font-medium">Analyze Profile</span> to generate a full developer intelligence report.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-slide-up">
            <ProfileHeader profile={profile} />
            <MetricsBentoGrid profile={profile} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <LanguageDonutChart languages={profile?.languages} />
                <div className="lg:col-span-2">
                    <TopReposBarChart repos={profile?.topRepos} />
                </div>
            </div>
            <ActivityAreaChart data={profile?.activityData} />
            <TopReposTable repos={profile?.topRepos} />
        </div>
    );
}