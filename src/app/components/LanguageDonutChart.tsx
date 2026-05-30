'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const DonutChartInner = dynamic(() => import('./LanguageDonutChartInner'), {
    ssr: false,
    loading: () => <ChartSkeleton height={280} />,
});

interface Props {
    languages: { id: string; name: string; count: number; pct: number }[];
}

export default function LanguageDonutChart({ languages }: Props) {
    return (
        <div className="card-elevated p-5">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">Language Breakdown</h3>
                <p className="text-xs text-muted-foreground mt-0.5">By repository count</p>
            </div>
            <DonutChartInner languages={languages} />
        </div>
    );
}