'use client';

import React from 'react';
import { AnalyzedProfile } from '@/app/stores/analysisStore';
import { Star, GitFork, Users, BookOpen, Calendar, } from 'lucide-react';

interface MetricsBentoGridProps {
    profile: AnalyzedProfile;
}

function ScoreRing({ score }: { score: number }) {
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 1000) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
                <circle cx="44" cy="44" r={radius} className="score-ring-track" />
                <circle
                    cx="44"
                    cy="44"
                    r={radius}
                    className="score-ring-fill"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold tabular-nums text-primary leading-none">{score}</span>
                <span className="text-2xs text-muted-foreground font-medium">/1000</span>
            </div>
        </div>
    );
}

export default function MetricsBentoGrid({ profile }: MetricsBentoGridProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
            {/* Hero card: Developer Score — spans 2 cols */}
            <div className="col-span-2 card-elevated p-5 flex items-center gap-5 glow-primary">
                <ScoreRing score={profile.score} />
                <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                        Developer Score
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl font-bold tabular-nums text-foreground">
                            {profile.score}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">/ 1000</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Level:{' '}
                        <span className="text-primary font-semibold">{profile.level}</span>
                    </p>
                    <p className="text-2xs text-muted-foreground mt-1">
                        Based on stars, forks, followers, and activity
                    </p>
                </div>
            </div>

            {/* Total Stars */}
            <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Total Stars
                    </p>
                    <Star size={14} className="text-warning" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground mb-1">
                    {profile.totalStars.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                    {profile.avgStarsPerRepo} avg / repo
                </p>
            </div>

            {/* Total Forks */}
            <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Total Forks
                    </p>
                    <GitFork size={14} className="text-accent" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground mb-1">
                    {profile.totalForks.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                    Across {profile.publicRepos} repositories
                </p>
            </div>

            {/* Followers */}
            <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Followers
                    </p>
                    <Users size={14} className="text-positive" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground mb-1">
                    {profile.followers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">
                    Following {profile.following.toLocaleString()}
                </p>
            </div>

            {/* Public Repos */}
            <div className="card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Public Repos
                    </p>
                    <BookOpen size={14} className="text-info" />
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground mb-1">
                    {profile.publicRepos}
                </p>
                <p className="text-xs text-muted-foreground">
                    Top: {profile.topLanguage}
                </p>
            </div>

            {/* Account Age — warning if stale (age < 2) */}
            <div className={`card-elevated p-5 ${profile.accountAgeYears < 2 ? 'border-warning/30 bg-[var(--warning-bg)]' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Account Age
                    </p>
                    <Calendar size={14} className={profile.accountAgeYears < 2 ? 'text-warning' : 'text-muted-foreground'} />
                </div>
                <p className="text-2xl font-bold tabular-nums text-foreground mb-1">
                    {profile.accountAgeYears}y
                </p>
                <p className="text-xs text-muted-foreground">
                    Since {new Date(profile.accountCreatedAt).getFullYear()}
                </p>
            </div>

            {/* Avg Stars — spans remaining to fill row (already 6 cards in 6-col) */}
            {/* Row is complete: 2 (score) + 1 + 1 + 1 + 1 + 1 = ... wait, that's 7 */}
            {/* Actually: col-span-2 + 4 singles = 6 total columns. Perfect. */}
        </div>
    );
}