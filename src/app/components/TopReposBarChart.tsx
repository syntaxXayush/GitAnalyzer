'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const BarChartInner = dynamic(() => import('./TopReposBarChartInner'), {
    ssr: false,
    loading: () => <ChartSkeleton height={240} />,
});

interface Props {
    repos: { id: string; name: string; stars: number; forks: number; language: string; pushedAt: string }[];
}

export default function TopReposBarChart({ repos }: Props) {
    return (
        <div className="card-elevated p-5 h-full">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">Top Repositories by Stars</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Most-starred public repositories</p>
            </div>
            <BarChartInner repos={repos} />
        </div>
    );
}