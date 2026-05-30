'use client';

import { create } from 'zustand';

export interface AnalyzedProfile {
    username: string;
    name: string;
    avatarUrl: string;
    bio: string;
    location: string;
    company: string;
    blog: string;
    publicRepos: number;
    followers: number;
    following: number;
    totalStars: number;
    totalForks: number;
    accountCreatedAt: string;
    accountAgeYears: number;
    score: number;
    level: string;
    topLanguage: string;
    avgStarsPerRepo: number;
    languages: { id: string; name: string; count: number; pct: number }[];
    topRepos: {
        id: string;
        name: string;
        stars: number;
        forks: number;
        language: string;
        pushedAt: string;
    }[];
    activityData: {
        id: string;
        month: string;
        commits: number;
        prs: number;
    }[];
    insights?: {
        summary: string;
        strengths: string[];
        opportunities: string[];
        activitySignal: string;
        riskFlags: string[];
    };
    activitySummary?: {
        commits: number;
        prs: number;
        issues: number;
        pushes: number;
        eventsScanned: number;
        recentActivityScore: number;
        lastActivityAt: string | null;
    };
    githubId?: number;
    githubProfileUrl?: string;
    analyzedAt: string;
}

interface AnalysisState {
    profile: AnalyzedProfile | null;
    isLoading: boolean;
    error: string | null;
    setProfile: (p: AnalyzedProfile) => void;
    setLoading: (v: boolean) => void;
    setError: (e: string | null) => void;
    clearProfile: () => void;
}

export const useAnalysisStore = create<AnalysisState>((set) => ({
    profile: null,
    isLoading: false,
    error: null,
    setProfile: (p) => set({ profile: p }),
    setLoading: (v) => set({ isLoading: v }),
    setError: (e) => set({ error: e }),
    clearProfile: () => set({ profile: null }),
}));