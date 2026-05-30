import React from 'react';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import AnalyzedProfiles from '@/app/analyzed-profiles/components/AnalyzedProfiles';

export default function AnalyzedProfilesPage() {
    return (
        <AppLayout>
            <ToastProvider />
            <div className="min-h-screen px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                            GitAnalyzer
                        </span>
                        <span className="text-muted-foreground opacity-40">·</span>
                        <span className="text-2xs font-semibold uppercase tracking-widest text-primary font-mono">
                            Analyzed Profiles
                        </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                        Analyzed Profiles
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        All GitHub profiles stored in the database. Search, filter, and manage analyses.
                    </p>
                </div>
                <AnalyzedProfiles />
            </div>
        </AppLayout>
    );
}