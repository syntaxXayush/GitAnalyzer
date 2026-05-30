'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2, AlertCircle, GitBranch, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useAnalysisStore } from '@/app/stores/analysisStore';
import { apiFetch } from '@/app/lib/api';

interface FormValues {
    username: string;
}

const QUICK_PROFILES = [
    { id: 'qp-torvalds', name: 'torvalds' },
    { id: 'qp-gvanrossum', name: 'gvanrossum' },
    { id: 'qp-sindresorhus', name: 'sindresorhus' },
    { id: 'qp-tj', name: 'tj' },
    { id: 'qp-addyosmani', name: 'addyosmani' },
];

export default function ProfileAnalyzerHero() {
    const { setProfile, setLoading, setError, isLoading } = useAnalysisStore();
    const [step, setStep] = useState<'idle' | 'fetching' | 'analyzing' | 'scoring' | 'done'>('idle');

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormValues>();

    const runAnalysis = async (username: string) => {
        setLoading(true);
        setError(null);

        setStep('fetching');
        await new Promise((r) => setTimeout(r, 200));

        setStep('analyzing');
        await new Promise((r) => setTimeout(r, 200));

        setStep('scoring');
        await new Promise((r) => setTimeout(r, 200));

        const response = await apiFetch<{ success: boolean; data: any; meta?: { cached?: boolean } }>(
            '/api/v1/profiles/analyze',
            {
                method: 'POST',
                body: JSON.stringify({ username }),
            },
        );

        setStep('done');

        setProfile(response.data);
        setLoading(false);
        toast.success(`Analysis complete for @${username}`, {
            description: response.meta?.cached ? 'Loaded from cache' : `Developer Score: ${response.data.score}/1000`,
        });
    };

    const onSubmit = (data: FormValues) => {
        const trimmed = data.username.trim().replace(/^@/, '');
        if (!trimmed) return;
        runAnalysis(trimmed).catch((error: unknown) => {
            const message = error instanceof Error ? error.message : 'Unable to analyze profile';
            setLoading(false);
            setStep('idle');
            setError(message);
            toast.error('Analysis failed', { description: message });
        });
    };

    const handleQuickSelect = (name: string) => {
        setValue('username', name);
        runAnalysis(name).catch((error: unknown) => {
            const message = error instanceof Error ? error.message : 'Unable to analyze profile';
            setLoading(false);
            setStep('idle');
            setError(message);
            toast.error('Analysis failed', { description: message });
        });
    };

    return (
        <div className="card-elevated p-6 mb-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-primary/10">
                    <GitBranch size={20} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-foreground">Analyze GitHub Profile</h2>
                    <p className="text-xs text-muted-foreground">
                        Fetches live data from the GitHub REST API
                    </p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse" />
                    <span className="text-2xs font-mono text-muted-foreground">GitHub API v3</span>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-xs font-medium text-foreground mb-1.5">
                        GitHub Username
                    </label>
                    <p className="text-2xs text-muted-foreground mb-2">
                        Enter the exact GitHub username (case-insensitive). Prefix @ is stripped automatically.
                    </p>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                                <GitBranch size={16} />
                            </span>
                            <input
                                id="username"
                                type="text"
                                placeholder="e.g. torvalds"
                                autoComplete="off"
                                spellCheck={false}
                                disabled={isLoading}
                                className={`w-full pl-9 pr-4 py-2.5 bg-muted border rounded-lg text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${errors.username ? 'border-negative' : 'border-border'
                                    }`}
                                {...register('username', {
                                    required: 'GitHub username is required',
                                    pattern: {
                                        value: /^@?[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
                                        message: 'Invalid GitHub username format',
                                    },
                                })}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 min-w-[130px] justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={15} className="animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Zap size={15} />
                                    <span>Analyze Profile</span>
                                </>
                            )}
                        </button>
                    </div>
                    {errors.username && (
                        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-negative">
                            <AlertCircle size={12} />
                            {errors.username.message}
                        </p>
                    )}
                </div>

                {/* Analysis progress steps */}
                {isLoading && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted border border-border animate-fade-in">
                        {[
                            { key: 'step-fetching', id: 'fetching', label: 'Fetching profile' },
                            { key: 'step-analyzing', id: 'analyzing', label: 'Analyzing repos' },
                            { key: 'step-scoring', id: 'scoring', label: 'Computing score' },
                        ].map((s, i) => {
                            const steps = ['fetching', 'analyzing', 'scoring', 'done'];
                            const currentIdx = steps.indexOf(step);
                            const stepIdx = steps.indexOf(s.id);
                            const isDone = currentIdx > stepIdx;
                            const isActive = currentIdx === stepIdx;
                            return (
                                <React.Fragment key={s.key}>
                                    <div className="flex items-center gap-1.5">
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 ${isDone
                                                    ? 'bg-positive/20 border border-positive'
                                                    : isActive
                                                        ? 'bg-primary/20 border border-primary' : 'bg-muted border border-border'
                                                }`}
                                        >
                                            {isDone ? (
                                                <span className="text-positive text-2xs">✓</span>
                                            ) : isActive ? (
                                                <Loader2 size={8} className="animate-spin text-primary" />
                                            ) : null}
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${isDone
                                                    ? 'text-positive'
                                                    : isActive
                                                        ? 'text-primary' : 'text-muted-foreground'
                                                }`}
                                        >
                                            {s.label}
                                        </span>
                                    </div>
                                    {i < 2 && (
                                        <div
                                            className={`flex-1 h-px transition-all duration-500 ${isDone ? 'bg-positive/40' : 'bg-border'
                                                }`}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Quick select */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs text-muted-foreground font-medium">Try:</span>
                    {QUICK_PROFILES.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleQuickSelect(p.name)}
                            className="px-2.5 py-1 rounded-full bg-muted border border-border text-2xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            @{p.name}
                        </button>
                    ))}
                </div>
            </form>
        </div>
    );
}

