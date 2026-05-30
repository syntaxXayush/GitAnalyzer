import React from 'react';
import AppLayout from '@/components/AppLayout';
import ToastProvider from '@/components/ui/Toast';
import ProfileAnalyzerHero from '@/app/components/ProfileAnalyzerHero';
import AnalysisResults from '@/app/components/AnalysisResults';

export default function ProfileAnalyzerPage() {
    return (
        <AppLayout>
            <ToastProvider />
            <div className="min-h-screen px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 max-w-screen-2xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xs font-semibold uppercase tracking-widest text-muted-foreground font-mono">
                            GitAnalyzer
                        </span>
                        <span className="text-muted-foreground opacity-40">·</span>
                        <span className="text-2xs font-semibold uppercase tracking-widest text-primary font-mono">
                            Profile Analyzer
                        </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">
                        GitHub Profile Analyzer
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Enter a GitHub username to generate a comprehensive developer intelligence report.
                    </p>
                </div>

                {/* Main content — Hero input + results */}
                <ProfileAnalyzerHero />
                <AnalysisResults />
            </div>
        </AppLayout>
    );
}